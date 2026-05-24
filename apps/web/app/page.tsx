import Link from 'next/link';
import { Plane, Shield, BookOpen } from 'lucide-react';
import { KCARS_2025_INSTRUMENTS, REG_84_UNEXTENDED_DEADLINE } from '@dnca/ontology';

export default function HomePage() {
  const ln42 = KCARS_2025_INSTRUMENTS.find((i) => i.instrumentId === 'LN-42-2026');
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-navy-900">
          Forward-deployed crew training management
        </h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Production rebuild of the Fokker 70/100 flight crew training platform for East African AOC
          holders. Multi-tenant; KCAA-aligned exports; audit-grade logging; CBTA-aligned competency
          grading per ICAO Doc 9868.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card
          href="/aircraft"
          icon={<Plane className="h-5 w-5" />}
          title="Aircraft Facts"
          body="F70/F70 HGW/F100 mass limits, engine and APU references, flap policy, OEI technique, fuel asymmetry — sourced from the typed domain package."
        />
        <Card
          href="/compliance"
          icon={<Shield className="h-5 w-5" />}
          title="Compliance Matrix"
          body="KCARs 2025 cross-referenced to ICAO, FAA and EASA across 9 regulatory domains. Each cell is a Citation in the regulatory ontology."
        />
        <Card
          icon={<BookOpen className="h-5 w-5" />}
          title="Knowledge Library"
          body="Operator-scoped training content keyed to LN 42/2026 Third Schedule §2.2 mandatory topics."
          comingSoon
        />
      </section>

      <section className="rounded-lg border border-amber-300 bg-amber-50 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-900">
          Regulatory cliff visibility
        </h2>
        <p className="mt-2 text-sm text-amber-900">
          {ln42?.shortLabel} effective <strong>{ln42?.effectiveDate}</strong>. Reg 84 transition
          window closes <strong>{REG_84_UNEXTENDED_DEADLINE}</strong> unless extended by the Cabinet
          Secretary. Every operator currently holds manuals citing the repealed 2018 framework.
        </p>
      </section>
    </div>
  );
}

function Card({
  href,
  icon,
  title,
  body,
  comingSoon,
}: {
  href?: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  comingSoon?: boolean;
}) {
  const inner = (
    <div className="h-full rounded-lg border border-slate-200 bg-white p-5 transition hover:border-navy-700 hover:shadow">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded bg-navy-900 text-white">
        {icon}
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-navy-900">{title}</h3>
        {comingSoon ? (
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-600">
            Coming soon
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-slate-700">{body}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
