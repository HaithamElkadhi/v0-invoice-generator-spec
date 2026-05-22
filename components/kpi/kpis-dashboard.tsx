"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3 } from "lucide-react"
import { AdmissionSection } from "@/components/kpi/admission-section"
import { ApplicationSection } from "@/components/kpi/application-section"
import { FinanceSection } from "@/components/finance/finance-section"

type KpiSectionId = "admission" | "application" | "finance" | "operations"

const KPI_SECTIONS: { id: KpiSectionId; label: string; active: boolean }[] = [
  { id: "admission", label: "Admission", active: true },
  { id: "application", label: "Application", active: true },
  { id: "finance", label: "Finance", active: true },
  { id: "operations", label: "Operations", active: false },
]

export function KpisDashboard() {
  const [activeSection, setActiveSection] = useState<KpiSectionId>("admission")

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex items-start gap-4">
          <Link
            href="/"
            className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            aria-label="Retour aux modules"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#163867] to-[#1f4f8f] text-white shadow-sm">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">JEExpert — KPIs</h1>
              <p className="text-sm text-slate-500">Tableaux de bord temps réel (Airtable)</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {KPI_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              disabled={!section.active}
              onClick={() => section.active && setActiveSection(section.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                !section.active
                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                  : activeSection === section.id
                    ? "bg-[#163867] text-white shadow-sm"
                    : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {section.label}
              {!section.active && (
                <span className="ml-1.5 text-xs opacity-80">(bientôt)</span>
              )}
            </button>
          ))}
        </nav>

        {activeSection === "admission" && <AdmissionSection />}
        {activeSection === "application" && <ApplicationSection />}
        {activeSection === "finance" && <FinanceSection />}
      </div>
    </div>
  )
}
