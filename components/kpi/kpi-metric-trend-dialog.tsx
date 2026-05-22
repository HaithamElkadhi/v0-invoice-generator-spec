"use client"

import { useMemo } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export type KpiNumericMetricKey = {
  [K in keyof KpiSnapshot]: KpiSnapshot[K] extends number ? K : never
}[keyof KpiSnapshot]

export interface KpiMetricSeries {
  key: KpiNumericMetricKey
  label: string
  color: string
}

function MetricTrendTooltip({
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
            {entry.name}: <span className="font-semibold tabular-nums">{entry.value}</span>
          </p>
        ))}
      </div>
    </div>
  )
}

interface KpiMetricTrendDialogProps {
  snapshots: KpiSnapshot[]
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  series: KpiMetricSeries[]
}

export function KpiMetricTrendDialog({
  snapshots,
  open,
  onOpenChange,
  title,
  description,
  series,
}: KpiMetricTrendDialogProps) {
  const chartData = useMemo(
    () =>
      snapshots.map((s) => {
        const point: Record<string, string | number> = {
          time: format(new Date(s.createdAt), "dd MMM yyyy HH:mm"),
        }
        for (const ser of series) {
          point[ser.key] = s[ser.key] as number
        }
        return point
      }),
    [snapshots, series]
  )

  const hasData = snapshots.some((s) =>
    series.some((ser) => (s[ser.key] as number) > 0)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-full max-w-3xl flex-col gap-0 overflow-hidden sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="mt-4 min-h-[320px] flex-1">
          {snapshots.length < 2 ? (
            <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
              Au moins 2 snapshots KPI sont nécessaires pour afficher une courbe.
            </p>
          ) : !hasData ? (
            <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
              Aucune valeur sur l&apos;historique des snapshots pour cette métrique.
            </p>
          ) : (
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip content={<MetricTrendTooltip />} />
                  {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
                  {series.map((s) => (
                    <Line
                      key={s.key}
                      type="monotone"
                      dataKey={s.key}
                      name={s.label}
                      stroke={s.color}
                      strokeWidth={2}
                      dot={{ r: 3, strokeWidth: 2 }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {snapshots.length >= 2 && hasData && (
          <p className="mt-3 text-xs text-slate-500">
            {snapshots.length} snapshot{snapshots.length > 1 ? "s" : ""} · du{" "}
            {format(new Date(snapshots[0].createdAt), "dd MMM yyyy")} au{" "}
            {format(new Date(snapshots[snapshots.length - 1].createdAt), "dd MMM yyyy")}
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
