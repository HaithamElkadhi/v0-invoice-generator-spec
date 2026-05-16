import type { KpiSnapshot } from "@/lib/kpi.types"
import { getDelta } from "@/lib/kpi.utils"
import { KpiDeltaDisplay } from "@/components/kpi/kpi-delta"

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
}[] = [
  {
    key: "potential",
    label: "Potential",
    description: "Formulaire rempli, premier contact en cours",
    cardClass: "bg-blue-100 border-blue-200",
    valueClass: "text-blue-800",
  },
  {
    key: "serious",
    label: "Serious",
    description: "Intérêt confirmé, qualification en cours",
    cardClass: "bg-purple-100 border-purple-200",
    valueClass: "text-purple-800",
  },
  {
    key: "undecided",
    label: "Undecided",
    description: "Hésitant — action commerciale directe",
    cardClass: "bg-orange-100 border-orange-200",
    valueClass: "text-orange-800",
  },
  {
    key: "engaged",
    label: "Engaged",
    description: "Documents + acompte — client actif",
    cardClass: "bg-emerald-100 border-emerald-200",
    valueClass: "text-emerald-800",
  },
  {
    key: "admitted",
    label: "Admitted",
    description: "Acceptation universitaire reçue",
    cardClass: "bg-green-100 border-green-200",
    valueClass: "text-green-800",
  },
  {
    key: "completed",
    label: "Completed",
    description: "Frais finaux payés — conversion totale",
    cardClass: "bg-teal-100 border-teal-200",
    valueClass: "text-teal-900",
  },
  {
    key: "lastChance",
    label: "Last chance",
    description: "Dernière relance avant perte",
    cardClass: "bg-amber-100 border-amber-200",
    valueClass: "text-amber-800",
  },
  {
    key: "lost",
    label: "Lost",
    description: "Hors processus définitivement",
    cardClass: "bg-red-100 border-red-200",
    valueClass: "text-red-800",
  },
  {
    key: "totalProspect",
    label: "Total Prospect",
    description: "Compteur global cumulatif",
    cardClass: "bg-gray-100 border-gray-200",
    valueClass: "text-gray-700",
  },
]

interface KpiStageCardsProps {
  latest: KpiSnapshot
  previous?: KpiSnapshot
}

export function KpiStageCards({ latest, previous }: KpiStageCardsProps) {
  const prev = previous ?? latest

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      {STAGES.map((stage) => {
        const value = latest[stage.key]
        const prevValue = prev[stage.key]
        const delta = getDelta(value, prevValue)
        const invert = stage.key === "lost" || stage.key === "lastChance"

        return (
          <article
            key={stage.key}
            className={`rounded-xl border p-4 ${stage.cardClass}`}
          >
            <p className={`text-3xl font-bold tabular-nums ${stage.valueClass}`}>{value}</p>
            <p className={`mt-1 text-sm font-semibold ${stage.valueClass}`}>{stage.label}</p>
            <p className="mt-1 line-clamp-2 text-xs text-slate-600">{stage.description}</p>
            <KpiDeltaDisplay delta={delta} invert={invert} className="mt-2" />
          </article>
        )
      })}
    </section>
  )
}
