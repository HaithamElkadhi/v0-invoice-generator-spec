import type { ConversionRate } from "@/lib/kpi.types"

interface KpiConversionRatesProps {
  rates: ConversionRate[]
}

function healthBadge(health: ConversionRate["health"], isCumulative: boolean, rate: number | null) {
  if (isCumulative && rate === null) {
    return { emoji: "⚪", label: "Cumulatif — N/A", barClass: "bg-slate-200" }
  }
  switch (health) {
    case "good":
      return { emoji: "🟢", label: "Bon", barClass: "bg-emerald-500" }
    case "warn":
      return { emoji: "🟡", label: "Attention", barClass: "bg-amber-400" }
    case "critical":
      return { emoji: "🔴", label: "Critique", barClass: "bg-rose-500" }
    default:
      return { emoji: "⚪", label: "N/A", barClass: "bg-slate-200" }
  }
}

export function KpiConversionRates({ rates }: KpiConversionRatesProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-900">Taux de conversion</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rates.map((rate) => {
          const badge = healthBadge(rate.health, rate.isCumulative, rate.rate)
          const displayRate =
            rate.rate === null
              ? rate.isCumulative
                ? "N/A"
                : "N/A"
              : `${rate.rate}%`
          const barWidth = rate.rate ?? 0
          const over100 = rate.rate !== null && rate.rate > 100

          return (
            <div
              key={rate.label}
              className="rounded-xl border border-slate-100 bg-slate-50/80 p-3"
            >
              <p className="text-xs font-medium text-slate-600">{rate.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">
                {displayRate}
                {over100 && (
                  <span className="ml-1 text-xs font-normal text-amber-600">(&gt;100% cumulatif)</span>
                )}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                className={`h-full rounded-full ${badge.barClass}`}
                style={{ width: rate.rate === null ? "0%" : `${Math.min(barWidth, 100)}%` }}
              />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {badge.emoji} {badge.label}
                {rate.isCumulative && rate.rate === null && " — données cumulatives"}
              </p>
            </div>
          )
        })}
      </div>
    </article>
  )
}
