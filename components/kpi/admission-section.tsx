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

export function AdmissionSection() {
  const { snapshots, loading, error, refetch } = useKpiData(60_000)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRefresh} />
  }

  if (snapshots.length === 0) {
    return (
      <ErrorState message="Aucun snapshot KPI trouvé dans Airtable." onRetry={handleRefresh} />
    )
  }

  const latest = snapshots[snapshots.length - 1]
  const previous = snapshots.length > 1 ? snapshots[snapshots.length - 2] : undefined
  const rates = computeConversionRates(latest)
  const alerts = generateAlerts(latest, previous)

  return (
    <section aria-labelledby="admission-kpi-heading" className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Section</p>
        <h2 id="admission-kpi-heading" className="text-lg font-semibold text-slate-900">
          Admission — pipeline commercial
        </h2>
      </div>

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
    </section>
  )
}
