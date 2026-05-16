"use client"

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { ApplicationRecord } from "@/lib/application.types"
import { computeUniversityStats, getUniversityBarColor } from "@/lib/application.utils"

interface UniversityBarChartProps {
  records: ApplicationRecord[]
}

export function UniversityBarChart({ records }: UniversityBarChartProps) {
  const universities = computeUniversityStats(records, 12)
  const chartHeight = universities.length * 36 + 60

  const chartData = universities.map((u) => ({
    name: u.name,
    total: u.total,
    admitted: u.admitted,
    fill: getUniversityBarColor(u),
  }))

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-900">Top 12 universités</h2>
      <p className="mb-3 text-xs text-slate-500">
        Couleur : vert ≥15% admission · bleu ≥5% · gris sinon
      </p>
      <div style={{ height: chartHeight }} className="w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
          >
            <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={160}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(128,128,128,0.08)" }}
              formatter={(value: number) => [`${value} candidatures`, "Total"]}
              labelStyle={{ fontWeight: 600 }}
            />
            <Bar dataKey="total" radius={[0, 3, 3, 0]} maxBarSize={28}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
