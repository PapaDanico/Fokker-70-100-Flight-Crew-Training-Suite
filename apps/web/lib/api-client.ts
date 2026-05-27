/**
 * Typed fetch client for the @dnca/api Fastify backend.
 *
 * All calls are server-side (Server Components / Route Handlers) — never
 * imported from a Client Component. The operator scope header is sourced
 * from server-only env; never leaked to the browser.
 *
 * The client does not re-validate response bodies — the API has already
 * Zod-validated outbound shapes against the schemas declared in
 * apps/api/src/routes/*.ts. If the API contract drifts, the typecheck on
 * shared @dnca/domain types catches it.
 */

import type {
  CurrencyKind,
  IsoDate,
  IsoDateTime,
  Pilot,
  PilotRole,
  TrainingPhase,
} from '@dnca/domain';
import { getApiConfig } from './api-config.js';

export type ApiPilot = Omit<Pilot, 'createdAt' | 'updatedAt'>;

export interface ApiCurrencyRecord {
  readonly id: string;
  readonly operatorId: string;
  readonly pilotId: string;
  readonly kind: CurrencyKind;
  readonly validFrom: IsoDate;
  readonly validTo: IsoDate;
  readonly sourceSessionId: string | null;
  readonly issuedByUserId: string | null;
  readonly notes: string | null;
  readonly supersededAt: IsoDateTime | null;
  readonly supersededBy: string | null;
  readonly createdAt: IsoDateTime;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly url: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(path: string): Promise<T> {
  const config = getApiConfig();
  if (!config) throw new ApiError('API not configured', 0, path);
  const url = `${config.baseUrl}${path}`;
  const res = await fetch(url, {
    headers: {
      'x-demo-operator-id': config.demoOperatorId,
      accept: 'application/json',
    },
    // Server Components are request-scoped already; cache: no-store keeps
    // currency data fresh per request without leaking across operator scopes.
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new ApiError(`API ${res.status} ${res.statusText}`, res.status, url);
  }
  return (await res.json()) as T;
}

export async function listPilots(): Promise<{ pilots: ApiPilot[]; asOf: string }> {
  return apiFetch<{ pilots: ApiPilot[]; asOf: string }>('/pilots');
}

export async function getPilot(id: string): Promise<ApiPilot> {
  return apiFetch<ApiPilot>(`/pilots/${encodeURIComponent(id)}`);
}

export async function listCurrencyRecords(
  pilotId: string,
): Promise<{ records: ApiCurrencyRecord[] }> {
  return apiFetch<{ records: ApiCurrencyRecord[] }>(
    `/pilots/${encodeURIComponent(pilotId)}/currency-records`,
  );
}

// Re-export the shared role/phase enums so pages can render without an extra
// @dnca/domain import alongside this client.
export type { CurrencyKind, PilotRole, TrainingPhase };
