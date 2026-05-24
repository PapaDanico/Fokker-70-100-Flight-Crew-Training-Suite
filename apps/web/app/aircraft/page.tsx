import { AIRCRAFT_FACTS, exceedsFdapThreshold } from '@dnca/domain';

export default function AircraftPage() {
  const variants = AIRCRAFT_FACTS.variants;
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">F70/100 Aircraft Facts</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-700">
          Authoritative type facts. Sourced from{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5">@dnca/domain</code> — the single source
          of truth per ADR 0004. Any drift between this page and the assessment generation prompt is
          impossible: both compose the same constants at module-load.
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
          Mass variants
        </h2>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-navy-900 text-white">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Variant</th>
                <th className="px-4 py-2 text-right font-medium">MTOW (kg)</th>
                <th className="px-4 py-2 text-right font-medium">MLW (kg)</th>
                <th className="px-4 py-2 text-right font-medium">MZFW (kg)</th>
                <th className="px-4 py-2 text-right font-medium">FDAP?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(Object.keys(variants) as Array<keyof typeof variants>).map((v) => {
                const m = variants[v];
                const fdap = exceedsFdapThreshold(m.mtowKg);
                return (
                  <tr key={v} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium">{v}</td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {m.mtowKg.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {m.mlwKg.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {m.mzfwKg.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {fdap ? (
                        <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-800">
                          Mandatory
                        </span>
                      ) : (
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                          N/A
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
            FDAP threshold: MTOW &gt; {AIRCRAFT_FACTS.fdapMtowThresholdKg.toLocaleString()} kg per
            KCARs Reg 56(2).
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Fact
          label="Engine"
          value={AIRCRAFT_FACTS.engine}
          note="Both F70 and F100 — no variants."
        />
        <Fact label="APU" value={AIRCRAFT_FACTS.apu} />
        <Fact
          label="Hydraulic systems"
          value={`${AIRCRAFT_FACTS.hydraulicSystemsCount} independent (Systems 1, 2, 3)`}
        />
        <Fact
          label="Approach speeds"
          value={AIRCRAFT_FACTS.approachSpeedSource}
          note="No paper speed cards when VMA is active."
        />
        <Fact
          label="OEI technique"
          value={`${AIRCRAFT_FACTS.oei.technique} with ${AIRCRAFT_FACTS.oei.bankIntoLiveEngineDeg}° bank into the live engine`}
        />
        <Fact
          label="Max fuel asymmetry"
          value={`${AIRCRAFT_FACTS.maxFuelAsymmetryKgEnroute.toLocaleString()} kg en-route`}
        />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
          Takeoff flap policy
        </h2>
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-700">
          <ul className="space-y-2">
            <li>
              Flaps <strong>{AIRCRAFT_FACTS.takeoffFlapPolicy.default}</strong> — default
            </li>
            <li>
              Flaps <strong>{AIRCRAFT_FACTS.takeoffFlapPolicy.performance}</strong> — performance
            </li>
            <li>
              Flaps <strong>{AIRCRAFT_FACTS.takeoffFlapPolicy.reserved}</strong> — reserved
            </li>
            <li className="rounded bg-red-50 px-3 py-2 text-red-800">
              Flaps{' '}
              <strong>{AIRCRAFT_FACTS.takeoffFlapPolicy.prohibitedOnContaminatedRunway}</strong> is{' '}
              <strong>PROHIBITED</strong> on contaminated runways
            </li>
            <li className="text-xs text-slate-600">
              TOCWS does not alert for Flaps 0 (a valid configuration). EICAS confirmation
              discipline is mandatory.
            </li>
          </ul>
          <div className="mt-4 border-t border-slate-200 pt-3 text-xs text-slate-600">
            Landing flaps: {AIRCRAFT_FACTS.landingFlaps.join(' or ')}
          </div>
        </div>
      </section>
    </div>
  );
}

function Fact({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-navy-900">{value}</div>
      {note ? <div className="mt-1 text-xs text-slate-600">{note}</div> : null}
    </div>
  );
}
