"use client"

import { useState } from "react"
import { useApplicationsData } from "@/hooks/use-applications-data"
import { ApplicationsGlobalStats } from "@/components/kpi/applications-global-stats"
import { ApplicationSkeleton } from "@/components/kpi/application-skeleton"
import { ErrorState } from "@/components/kpi/error-state"
import { StudentStackedBars } from "@/components/kpi/student-stacked-bars"
import { UniversityBarChart } from "@/components/kpi/university-bar-chart"

export function ApplicationSection() {
  const { records, loading, error, refetch } = useApplicationsData(60_000)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  if (loading) {
    return <ApplicationSkeleton />
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRefresh} />
  }

  if (records.length === 0) {
    return (
      <ErrorState
        message="Aucune candidature trouvée dans Airtable (Prospects Applications)."
        onRetry={handleRefresh}
      />
    )
  }

  return (
    <section aria-labelledby="application-kpi-heading" className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Section</p>
          <h2 id="application-kpi-heading" className="text-lg font-semibold text-slate-900">
            Application — candidatures universitaires
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {records.length} candidatures · polling 60s
            {refreshing && " · actualisation…"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Actualiser
        </button>
      </div>

      <ApplicationsGlobalStats records={records} />
      <StudentStackedBars records={records} />
      <UniversityBarChart records={records} />
    </section>
  )
}
