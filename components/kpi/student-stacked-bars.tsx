"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import type { ApplicationRecord } from "@/lib/application.types"
import { computeStudentStats, getSegmentWidths } from "@/lib/application.utils"
import { Input } from "@/components/ui/input"

const SEGMENT_COLORS = {
  submitted: "#378ADD",
  admitted: "#639922",
  rejected: "#E24B4A",
  proposal: "#7F77DD",
} as const

interface StudentStackedBarsProps {
  records: ApplicationRecord[]
}

export function StudentStackedBars({ records }: StudentStackedBarsProps) {
  const [query, setQuery] = useState("")
  const students = useMemo(() => computeStudentStats(records), [records])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return students
    return students.filter((s) => s.name.toLowerCase().includes(q))
  }, [students, query])

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-slate-900">Candidatures par étudiant</h2>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Rechercher un étudiant…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 pl-9 pr-9"
            aria-label="Rechercher un étudiant"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Effacer la recherche"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {query.trim() && (
        <p className="mb-3 text-xs text-slate-500">
          {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} sur {students.length} étudiants
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-4 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: SEGMENT_COLORS.submitted }} />
          Submitted
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: SEGMENT_COLORS.admitted }} />
          Admitted
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: SEGMENT_COLORS.rejected }} />
          Rejected
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: SEGMENT_COLORS.proposal }} />
          Proposal
        </span>
      </div>

      <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            {query.trim()
              ? `Aucun étudiant ne correspond à « ${query.trim()} »`
              : "Aucun étudiant à afficher"}
          </p>
        ) : (
          filtered.map((student) => {
            const widths = getSegmentWidths(student)
            const tooltip = [
              student.name,
              `Submitted: ${student.submitted}  |  Admitted: ${student.admitted}  |  Rejected: ${student.rejected}  |  Proposal: ${student.proposal}`,
              `Total: ${student.total} candidatures`,
            ].join("\n")

            return (
              <div key={student.name} className="flex items-center gap-3" title={tooltip}>
                <span className="w-[120px] shrink-0 truncate text-right text-xs font-medium text-slate-700">
                  {student.name}
                </span>
                <div className="flex h-5 flex-1 overflow-hidden rounded-sm bg-slate-100">
                  {student.submitted > 0 && (
                    <div
                      style={{ width: `${widths.subPct}%`, background: SEGMENT_COLORS.submitted }}
                      className="h-full min-w-0"
                    />
                  )}
                  {student.admitted > 0 && (
                    <div
                      style={{ width: `${widths.admPct}%`, background: SEGMENT_COLORS.admitted }}
                      className="h-full min-w-0"
                    />
                  )}
                  {student.rejected > 0 && (
                    <div
                      style={{ width: `${widths.rejPct}%`, background: SEGMENT_COLORS.rejected }}
                      className="h-full min-w-0"
                    />
                  )}
                  {student.proposal > 0 && (
                    <div
                      style={{ width: `${widths.proPct}%`, background: SEGMENT_COLORS.proposal }}
                      className="h-full min-w-0"
                    />
                  )}
                </div>
                <span className="w-7 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-800">
                  {student.total}
                </span>
              </div>
            )
          })
        )}
      </div>
    </article>
  )
}
