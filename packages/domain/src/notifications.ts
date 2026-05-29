import type { IsoDate, OperatorId, PilotId } from './branded.js';
import {
  CURRENCY_KIND,
  daysBetween,
  statusFor,
  type CurrencyKind,
  type CurrencyRecord,
} from './currency.js';
import { lookupCurrency } from './currency-catalog.js';
import type { Pilot } from './pilot.js';

/**
 * Notification engine (Sprint 3) — pure computation of currency-expiry alerts.
 *
 * Given the crew and their currency records, returns one alert per (pilot,
 * kind) that has entered the expiry cascade, tagged with the threshold band it
 * has crossed and a severity. Dispatch (email/SMS/Telegram) and once-per-band
 * de-duplication live at the edges; this function is side-effect-free and uses
 * the same statusFor()/daysBetween() as the dashboard so the numbers match.
 */

/** Cascade thresholds (days to expiry), widest first — per CLAUDE.md. */
export const NOTIFICATION_THRESHOLDS_DAYS = [90, 60, 30, 14, 7] as const;
export type NotificationThreshold = (typeof NOTIFICATION_THRESHOLDS_DAYS)[number];

export type NotificationSeverity = 'INFO' | 'WARN' | 'URGENT' | 'EXPIRED';
export type NotificationChannel = 'EMAIL' | 'SMS' | 'TELEGRAM';

export interface ExpiryNotification {
  readonly operatorId: OperatorId;
  readonly pilotId: PilotId;
  readonly pilotName: string;
  readonly kind: CurrencyKind;
  readonly label: string;
  readonly validTo: IsoDate;
  readonly daysToExpiry: number;
  /** Widest cascade band entered (90/60/30/14/7), or 0 once expired. */
  readonly thresholdDays: NotificationThreshold | 0;
  readonly severity: NotificationSeverity;
  /** Suggested dispatch channels for this severity (operator may override). */
  readonly channels: ReadonlyArray<NotificationChannel>;
}

function severityFor(daysToExpiry: number): NotificationSeverity {
  if (daysToExpiry <= 0) return 'EXPIRED';
  if (daysToExpiry <= 14) return 'URGENT';
  if (daysToExpiry <= 30) return 'WARN';
  return 'INFO';
}

function channelsFor(severity: NotificationSeverity): ReadonlyArray<NotificationChannel> {
  switch (severity) {
    case 'EXPIRED':
    case 'URGENT':
      return ['EMAIL', 'SMS', 'TELEGRAM'];
    case 'WARN':
      return ['EMAIL', 'TELEGRAM'];
    default:
      return ['EMAIL'];
  }
}

/** The widest threshold band the item has entered (smallest T with days <= T). */
function thresholdFor(daysToExpiry: number): NotificationThreshold | 0 {
  if (daysToExpiry <= 0) return 0;
  for (const t of [...NOTIFICATION_THRESHOLDS_DAYS].sort((a, b) => a - b)) {
    if (daysToExpiry <= t) return t;
  }
  return 90;
}

function latestByPilotKind(
  records: ReadonlyArray<CurrencyRecord>,
): ReadonlyMap<string, CurrencyRecord> {
  const m = new Map<string, CurrencyRecord>();
  for (const r of records) {
    if (r.supersededAt !== undefined) continue;
    const key = `${r.pilotId}|${r.kind}`;
    const existing = m.get(key);
    if (existing === undefined || Date.parse(r.createdAt) >= Date.parse(existing.createdAt)) {
      m.set(key, r);
    }
  }
  return m;
}

/** Every currency kind is notifiable (personal docs, type, operational, …). */
const CURRENCY_KINDS_TO_NOTIFY: ReadonlyArray<CurrencyKind> = CURRENCY_KIND;

export interface ComputeNotificationsArgs {
  readonly pilots: ReadonlyArray<Pilot>;
  readonly currencyRecords: ReadonlyArray<CurrencyRecord>;
  readonly asOf: IsoDate;
}

/**
 * Pure: one ExpiryNotification per (active pilot, currency kind) inside the
 * 90-day cascade, most-urgent first. Excludes NOT_APPLICABLE items, items with
 * no record, inactive pilots, and items more than 90 days out.
 */
export function computeDueNotifications(args: ComputeNotificationsArgs): ExpiryNotification[] {
  const index = latestByPilotKind(args.currencyRecords);
  const out: ExpiryNotification[] = [];

  for (const pilot of args.pilots) {
    if (!pilot.active) continue;
    for (const c of CURRENCY_KINDS_TO_NOTIFY) {
      const rec = index.get(`${pilot.id}|${String(c)}`);
      if (rec?.validTo === undefined) continue;
      const status = statusFor({
        kind: c,
        phase: pilot.phase,
        validTo: rec.validTo,
        asOf: args.asOf,
      });
      if (status === 'NOT_APPLICABLE' || status === 'CURRENT') continue;

      const daysToExpiry = daysBetween(args.asOf, rec.validTo);
      const severity = severityFor(daysToExpiry);
      out.push({
        operatorId: pilot.operatorId,
        pilotId: pilot.id,
        pilotName: pilot.fullName,
        kind: c,
        label: lookupCurrency(c).label,
        validTo: rec.validTo,
        daysToExpiry,
        thresholdDays: thresholdFor(daysToExpiry),
        severity,
        channels: channelsFor(severity),
      });
    }
  }

  out.sort((a, b) => a.daysToExpiry - b.daysToExpiry);
  return out;
}
