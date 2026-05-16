"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { KpiSnapshot } from "@/lib/kpi.types"

interface KpiTrendChartProps {
  snapshots: KpiSnapshot[]
}

const SERIES = [
  { key: "potential", label: "Potential", color: "#1d4ed8", dashed: false },
  { key: "serious", label: "Serious", color: "#7e22ce", dashed: false },
  { key: "undecided", label: "Undecided", color: "#ea580c", dashed: false },
  { key: "engaged", label: "Engaged", color: "#059669", dashed: false },
  { key: "admitted", label: "Admitted", color: "#16a34a", dashed: false },
  { key: "completed", label: "Completed", color: "#0f766e", dashed: false },
  { key: "lastChance", label: "Last chance", color: "#d97706", dashed: true },
  { key: "lost", label: "Lost", color: "#dc2626", dashed: true },
  { key: "totalProspect", label: "Total", color: "#475569", dashed: false },
] as const

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-lg">
      <p className="mb-2 font-semibold text-slate-800">{label}</p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    </div>
  )
}

export function KpiTrendChart({ snapshots }: KpiTrendChartProps) {
  const [hidden, setHidden] = useState<Set<string>>(new Set())

  const chartData = useMemo(
    () =>
      snapshots.map((s) => ({
        time: format(new Date(s.createdAt), "dd MMM HH:mm"),
        potential: s.potential,
        serious: s.serious,
        undecided: s.undecided,
        engaged: s.engaged,
        admitted: s.admitted,
        completed: s.completed,
        lastChance: s.lastChance,
        lost: s.lost,
        totalProspect: s.totalProspect,
      })),
    [snapshots]
  )

  const toggleSeries = (key: string) => {
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  if (snapshots.length < 3) {
    return (
      <article className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Évolution dans le temps</h2>
        <p className="mt-2 text-sm text-slate-500">
          Pas assez de données — ajoutez des snapshots KPI
        </p>
      </article>
    )
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-900">Évolution dans le temps</h2>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              onClick={(e) => {
                const key = SERIES.find((s) => s.label === e.value)?.key
                if (key) toggleSeries(key)
              }}
              wrapperStyle={{ cursor: "pointer", fontSize: 12 }}
            />
            {SERIES.map((s) =>
              hidden.has(s.key) ? null : (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2}
                  strokeDasharray={s.dashed ? "6 4" : undefined}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-slate-500">Cliquez sur la légende pour afficher / masquer une série.</p>
    </article>
  )
}
