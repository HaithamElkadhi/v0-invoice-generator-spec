import type { ApplicationRecord } from "@/lib/application.types"
import { computeGlobalStats } from "@/lib/application.utils"

interface ApplicationsGlobalStatsProps {
  records: ApplicationRecord[]
}

export function ApplicationsGlobalStats({ records }: ApplicationsGlobalStatsProps) {
  const stats = computeGlobalStats(records)

  const cards = [
    {
      label: "Total applications",
      value: stats.total,
      sub: "toutes universités, tous statuts",
      color: "text-slate-900",
    },
    {
      label: "Étudiants en process",
      value: stats.studentsInProcess,
      sub: "étudiants uniques (champ Full Name)",
      color: "text-[#534AB7]",
    },
    {
      label: "Submitted",
      value: stats.submitted,
      sub: `${stats.submittedRate}% — en attente de réponse`,
      color: "text-[#185FA5]",
    },
    {
      label: "Admitted",
      value: stats.admitted,
      sub: `${stats.admissionRate}% de taux d'admission`,
      color: "text-[#3B6D11]",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      sub: `${stats.rejectionRate}% — à analyser`,
      color: "text-[#A32D2D]",
    },
  ]

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="text-xs font-medium text-slate-500">{card.label}</p>
          <p className={`mt-1 text-3xl font-bold tabular-nums ${card.color}`}>{card.value}</p>
          <p className="mt-1 text-xs leading-snug text-slate-500">{card.sub}</p>
        </article>
      ))}
    </section>
  )
}
