"use client"

import { motion } from "framer-motion"
import type { KpiSnapshot } from "@/lib/kpi.types"
import { safeRate } from "@/lib/kpi.utils"

interface KpiFunnelProps {
  snapshot: KpiSnapshot
}

const FUNNEL_ROWS: {
  label: string
  getValue: (s: KpiSnapshot) => number
  barClass: string
  pctClass: string
}[] = [
  { label: "Total", getValue: (s) => s.totalProspect, barClass: "bg-slate-400", pctClass: "text-slate-600" },
  { label: "Serious", getValue: (s) => s.serious, barClass: "bg-amber-400", pctClass: "text-amber-700" },
  { label: "Potential", getValue: (s) => s.potential, barClass: "bg-amber-400", pctClass: "text-amber-700" },
  { label: "Undecided", getValue: (s) => s.undecided, barClass: "bg-amber-400", pctClass: "text-amber-700" },
  { label: "Engaged", getValue: (s) => s.engaged, barClass: "bg-emerald-500", pctClass: "text-emerald-700" },
  { label: "Admitted", getValue: (s) => s.admitted, barClass: "bg-emerald-500", pctClass: "text-emerald-700" },
  { label: "Completed", getValue: (s) => s.completed, barClass: "bg-emerald-600", pctClass: "text-emerald-800" },
  { label: "Last chance", getValue: (s) => s.lastChance, barClass: "bg-rose-500", pctClass: "text-rose-700" },
  { label: "Lost", getValue: (s) => s.lost, barClass: "bg-rose-500", pctClass: "text-rose-700" },
]

export function KpiFunnel({ snapshot }: KpiFunnelProps) {
  const base = snapshot.totalProspect || 1

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-900">Entonnoir pipeline</h2>
      <div className="space-y-3">
        {FUNNEL_ROWS.map((row, index) => {
          const value = row.getValue(snapshot)
          const pct = safeRate(value, base) ?? 0
          const widthPct = base > 0 ? (value / base) * 100 : 0

          return (
            <div key={row.label} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-right text-xs font-medium text-slate-600">
                {row.label}
              </span>
              <div className="h-6 flex-1 overflow-hidden rounded-md bg-slate-100">
                <motion.div
                  className={`h-full rounded-md ${row.barClass}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ duration: 0.8, delay: index * 0.06, ease: "easeOut" }}
                />
              </div>
              <span className={`w-16 shrink-0 text-right text-xs font-semibold tabular-nums ${row.pctClass}`}>
                {pct}% · {value}
              </span>
            </div>
          )
        })}
      </div>
    </article>
  )
}
