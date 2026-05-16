import type { KpiSnapshot } from "@/lib/kpi.types"
import { getDelta } from "@/lib/kpi.utils"
import { KpiDeltaDisplay } from "@/components/kpi/kpi-delta"

interface KpiTotalBannerProps {
  latest: KpiSnapshot
  previous?: KpiSnapshot
}

export function KpiTotalBanner({ latest, previous }: KpiTotalBannerProps) {
  const prev = previous ?? latest
  const atRisk = latest.lost + latest.lastChance

  const metrics = [
    {
      label: "Total prospects",
      value: latest.totalProspect,
      delta: getDelta(latest.totalProspect, prev.totalProspect),
      invert: false,
      valueClass: "text-slate-700",
    },
    {
      label: "Clients actifs",
      sublabel: "Engaged",
      value: latest.engaged,
      delta: getDelta(latest.engaged, prev.engaged),
      invert: false,
      valueClass: "text-emerald-600",
    },
    {
      label: "À risque",
      sublabel: "Lost + Last chance",
      value: atRisk,
      delta: getDelta(atRisk, prev.lost + prev.lastChance),
      invert: true,
      valueClass: "text-rose-600",
    },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {metrics.map((m) => (
        <article
          key={m.label}
          className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
        >
          <p className={`text-4xl font-bold tabular-nums sm:text-5xl ${m.valueClass}`}>{m.value}</p>
          <p className="mt-2 text-sm font-semibold text-slate-800">{m.label}</p>
          {m.sublabel && <p className="text-xs text-slate-500">{m.sublabel}</p>}
          <KpiDeltaDisplay delta={m.delta} invert={m.invert} className="mt-3 justify-center" />
        </article>
      ))}
    </section>
  )
}
