"use client"

import { useState } from "react"
import { useKpiData } from "@/hooks/use-kpi-data"
import { computeConversionRates, generateAlerts } from "@/lib/kpi.utils"
import { DashboardHeader } from "@/components/kpi/dashboard-header"
import { DashboardSkeleton } from "@/components/kpi/dashboard-skeleton"
import { ErrorState } from "@/components/kpi/error-state"
import { KpiAlerts } from "@/components/kpi/kpi-alerts"
import { KpiConversionRates } from "@/components/kpi/kpi-conversion-rates"
import { KpiFunnel } from "@/components/kpi/kpi-funnel"
import { KpiStageCards } from "@/components/kpi/kpi-stage-cards"
import { KpiTotalBanner } from "@/components/kpi/kpi-total-banner"
import { KpiTrendChart } from "@/components/kpi/kpi-trend-chart"

const KPI_SECTIONS = [
  { id: "admission", label: "Admission", active: true },
  { id: "finance", label: "Finance", active: false },
  { id: "operations", label: "Operations", active: false },
] as const

export function AdmissionDashboard() {
  const { snapshots, loading, error, refetch } = useKpiData(60_000)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f6fb]">
        <DashboardSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f3f6fb]">
        <ErrorState message={error} onRetry={handleRefresh} />
      </div>
    )
  }

  if (snapshots.length === 0) {
    return (
      <div className="min-h-screen bg-[#f3f6fb]">
        <ErrorState message="Aucun snapshot KPI trouvé dans Airtable." onRetry={handleRefresh} />
      </div>
    )
  }

  const latest = snapshots[snapshots.length - 1]
  const previous = snapshots.length > 1 ? snapshots[snapshots.length - 2] : undefined
  const rates = computeConversionRates(latest)
  const alerts = generateAlerts(latest, previous)

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {KPI_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              disabled={!section.active}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                section.active
                  ? "bg-[#163867] text-white shadow-sm"
                  : "cursor-not-allowed bg-slate-100 text-slate-400"
              }`}
            >
              {section.label}
              {!section.active && (
                <span className="ml-1.5 text-xs opacity-80">(bientôt)</span>
              )}
            </button>
          ))}
        </nav>

        <section aria-labelledby="admission-kpi-heading">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
            Section
          </p>
          <h2 id="admission-kpi-heading" className="mb-6 text-lg font-semibold text-slate-900">
            Admission — pipeline commercial
          </h2>

          <div className="space-y-8">
            <DashboardHeader
              lastUpdated={latest.createdAt}
              onRefresh={handleRefresh}
              refreshing={refreshing}
            />
            <KpiTotalBanner latest={latest} previous={previous} />
            <KpiStageCards latest={latest} previous={previous} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <KpiFunnel snapshot={latest} />
              <KpiConversionRates rates={rates} />
            </div>
            <KpiTrendChart snapshots={snapshots} />
            <KpiAlerts alerts={alerts} />
          </div>
        </section>
      </div>
    </div>
  )
}
