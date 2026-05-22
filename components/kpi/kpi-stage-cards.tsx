"use client"

import { useState } from "react"
import { LineChart } from "lucide-react"
import type { KpiSnapshot } from "@/lib/kpi.types"
import { getDelta } from "@/lib/kpi.utils"
import { KpiDeltaDisplay } from "@/components/kpi/kpi-delta"
import {
  KpiMetricTrendDialog,
  type KpiNumericMetricKey,
} from "@/components/kpi/kpi-metric-trend-dialog"
import { Button } from "@/components/ui/button"

const STAGES: {
  key: keyof Pick<
    KpiSnapshot,
    | "potential"
    | "serious"
    | "undecided"
    | "engaged"
    | "admitted"
    | "completed"
    | "lastChance"
    | "lost"
    | "totalProspect"
  >
  label: string
  description: string
  cardClass: string
  valueClass: string
  chartColor: string
}[] = [
  {
    key: "potential",
    label: "Potential",
    description: "Formulaire rempli, premier contact en cours",
    cardClass: "bg-blue-100 border-blue-200",
    valueClass: "text-blue-800",
    chartColor: "#1d4ed8",
  },
  {
    key: "serious",
    label: "Serious",
    description: "Intérêt confirmé, qualification en cours",
    cardClass: "bg-purple-100 border-purple-200",
    valueClass: "text-purple-800",
    chartColor: "#7e22ce",
  },
  {
    key: "undecided",
    label: "Undecided",
    description: "Hésitant — action commerciale directe",
    cardClass: "bg-orange-100 border-orange-200",
    valueClass: "text-orange-800",
    chartColor: "#ea580c",
  },
  {
    key: "engaged",
    label: "Engaged",
    description: "Documents + acompte — client actif",
    cardClass: "bg-emerald-100 border-emerald-200",
    valueClass: "text-emerald-800",
    chartColor: "#059669",
  },
  {
    key: "admitted",
    label: "Admitted",
    description: "Acceptation universitaire reçue",
    cardClass: "bg-green-100 border-green-200",
    valueClass: "text-green-800",
    chartColor: "#16a34a",
  },
  {
    key: "completed",
    label: "Completed",
    description: "Frais finaux payés — conversion totale",
    cardClass: "bg-teal-100 border-teal-200",
    valueClass: "text-teal-900",
    chartColor: "#0f766e",
  },
  {
    key: "lastChance",
    label: "Last chance",
    description: "Dernière relance avant perte",
    cardClass: "bg-amber-100 border-amber-200",
    valueClass: "text-amber-800",
    chartColor: "#d97706",
  },
  {
    key: "lost",
    label: "Lost",
    description: "Hors processus définitivement",
    cardClass: "bg-red-100 border-red-200",
    valueClass: "text-red-800",
    chartColor: "#dc2626",
  },
  {
    key: "totalProspect",
    label: "Total Prospect",
    description: "Compteur global cumulatif",
    cardClass: "bg-gray-100 border-gray-200",
    valueClass: "text-gray-700",
    chartColor: "#475569",
  },
]

type StageKey = (typeof STAGES)[number]["key"]

interface KpiStageCardsProps {
  snapshots: KpiSnapshot[]
  latest: KpiSnapshot
  previous?: KpiSnapshot
}

export function KpiStageCards({ snapshots, latest, previous }: KpiStageCardsProps) {
  const prev = previous ?? latest
  const [trendStageKey, setTrendStageKey] = useState<StageKey | null>(null)

  const activeStage = STAGES.find((s) => s.key === trendStageKey)

  return (
    <>
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {STAGES.map((stage) => {
          const value = latest[stage.key]
          const prevValue = prev[stage.key]
          const delta = getDelta(value, prevValue)
          const invert = stage.key === "lost" || stage.key === "lastChance"

          return (
            <article
              key={stage.key}
              className={`flex flex-col rounded-xl border p-4 ${stage.cardClass}`}
            >
              <p className={`text-3xl font-bold tabular-nums ${stage.valueClass}`}>{value}</p>
              <p className={`mt-1 text-sm font-semibold ${stage.valueClass}`}>{stage.label}</p>
              <p className="mt-1 line-clamp-2 flex-1 text-xs text-slate-600">{stage.description}</p>
              <KpiDeltaDisplay delta={delta} invert={invert} className="mt-2" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 h-8 w-full border-slate-300/80 bg-white/60 text-xs hover:bg-white"
                onClick={() => setTrendStageKey(stage.key)}
              >
                <LineChart className="size-3.5" aria-hidden />
                Évolution
              </Button>
            </article>
          )
        })}
      </section>

      {activeStage && (
        <KpiMetricTrendDialog
          snapshots={snapshots}
          open={trendStageKey !== null}
          onOpenChange={(open) => {
            if (!open) setTrendStageKey(null)
          }}
          title={`${activeStage.label} — évolution`}
          description={`Nombre de ${activeStage.label} par snapshot KPI Airtable.`}
          series={[
            {
              key: activeStage.key as KpiNumericMetricKey,
              label: activeStage.label,
              color: activeStage.chartColor,
            },
          ]}
        />
      )}
    </>
  )
}
