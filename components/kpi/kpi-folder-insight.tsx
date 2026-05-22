"use client"

import { useState } from "react"
import { LineChart } from "lucide-react"
import type { FolderInsight, KpiSnapshot } from "@/lib/kpi.types"
import { computeFolderInsight, getDelta } from "@/lib/kpi.utils"
import { KpiDeltaDisplay } from "@/components/kpi/kpi-delta"
import { KpiFolderTrendDialog } from "@/components/kpi/kpi-folder-trend-dialog"
import { Button } from "@/components/ui/button"

interface KpiFolderInsightProps {
  snapshots: KpiSnapshot[]
  latest: KpiSnapshot
  previous?: KpiSnapshot
}

function pct(rate: number | null): string {
  return rate === null ? "—" : `${rate}%`
}

function insightMessage(insight: FolderInsight, snap: KpiSnapshot): string {
  const { originalFolder, translatedFolder, engaged, admitted } = snap

  if (originalFolder === 0 && translatedFolder === 0) {
    return "Aucune valeur sur Original_Folder ou Translated_Folder dans ce snapshot."
  }

  const parts = [
    `${originalFolder} dossier${originalFolder !== 1 ? "s" : ""} avec pièces en langue source`,
    `${translatedFolder} avec version traduite`,
  ]

  if (insight.overlapFloor > 0) {
    parts.push(`au moins ${insight.overlapFloor} dans les deux colonnes`)
  }

  let message = `${parts.join(" · ")}. Les compteurs se chevauchent : un dossier peut être original et traduit.`

  if (engaged > 0) {
    const coverage = [
      insight.originalVsEngaged !== null
        ? `${insight.originalVsEngaged}% ratio originaux/Engaged`
        : null,
      insight.translatedVsEngaged !== null
        ? `${insight.translatedVsEngaged}% ratio traduits/Engaged`
        : null,
    ]
      .filter(Boolean)
      .join(" · ")
    message += ` Par rapport aux ${engaged} Engaged : ${coverage}.`
    if (translatedFolder < engaged) {
      message += ` ${engaged - translatedFolder} Engaged de plus que de dossiers traduits — à valider si chaque client doit avoir une traduction.`
    }
  }

  if (admitted > 0 && insight.translatedVsAdmitted !== null) {
    message += ` ${insight.translatedVsAdmitted}% ratio traduits/Admitted.`
  }

  return message
}

function CoverageBar({
  label,
  rate,
  count,
  denominator,
  barClass,
}: {
  label: string
  rate: number | null
  count: number
  denominator: number
  barClass: string
}) {
  const width = rate === null ? 0 : Math.min(rate, 100)

  return (
    <div>
      <div className="mb-1 flex justify-between gap-2 text-xs text-slate-600">
        <span>{label}</span>
        <span className="tabular-nums">
          {count} / {denominator} ({pct(rate)})
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

export function KpiFolderInsight({ snapshots, latest, previous }: KpiFolderInsightProps) {
  const [trendOpen, setTrendOpen] = useState(false)
  const prev = previous ?? latest
  const insight = computeFolderInsight(latest)

  const countMetrics = [
    {
      label: "Original_Folder",
      sublabel: "Pièces en langue source (non exclusif)",
      value: latest.originalFolder,
      delta: getDelta(latest.originalFolder, prev.originalFolder),
      valueClass: "text-amber-800",
    },
    {
      label: "Translated_Folder",
      sublabel: "Version traduite disponible (non exclusif)",
      value: latest.translatedFolder,
      delta: getDelta(latest.translatedFolder, prev.translatedFolder),
      valueClass: "text-indigo-800",
    },
  ]

  const ratioMetrics = [
    {
      label: "Originaux / Engaged",
      value: pct(insight.originalVsEngaged),
      sublabel: "Couverture documents source",
    },
    {
      label: "Traduits / Engaged",
      value: pct(insight.translatedVsEngaged),
      sublabel: "Couverture traduction vs clients actifs",
    },
    {
      label: "Traduits / Admitted",
      value: pct(insight.translatedVsAdmitted),
      sublabel: "Traduction vs dossiers admis",
    },
  ]

  return (
    <>
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Dossiers — original & traduit</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Compteurs Airtable indépendants · un dossier peut apparaître dans les deux
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => setTrendOpen(true)}
          >
            <LineChart className="size-4" aria-hidden />
            Évolution dans le temps
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {countMetrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-center"
            >
              <p className={`text-3xl font-bold tabular-nums ${m.valueClass}`}>{m.value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{m.label}</p>
              <p className="text-xs text-slate-500">{m.sublabel}</p>
              <KpiDeltaDisplay delta={m.delta} className="mt-2 justify-center" />
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {ratioMetrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-slate-100 bg-white p-3 text-center"
            >
              <p className="text-2xl font-bold tabular-nums text-slate-900">{m.value}</p>
              <p className="mt-1 text-xs font-semibold text-slate-700">{m.label}</p>
              <p className="text-xs text-slate-500">{m.sublabel}</p>
            </div>
          ))}
        </div>

        {latest.engaged > 0 && (
          <div className="mt-4 space-y-3">
            <CoverageBar
              label="Original vs Engaged"
              rate={insight.originalVsEngaged}
              count={latest.originalFolder}
              denominator={latest.engaged}
              barClass="bg-amber-400"
            />
            <CoverageBar
              label="Translated vs Engaged"
              rate={insight.translatedVsEngaged}
              count={latest.translatedFolder}
              denominator={latest.engaged}
              barClass="bg-indigo-500"
            />
          </div>
        )}

        <p className="mt-4 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          {insightMessage(insight, latest)}
        </p>
      </article>

      <KpiFolderTrendDialog
        snapshots={snapshots}
        open={trendOpen}
        onOpenChange={setTrendOpen}
      />
    </>
  )
}
