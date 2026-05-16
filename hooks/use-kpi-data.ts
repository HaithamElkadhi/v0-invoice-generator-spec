"use client"

import { useCallback, useEffect, useState } from "react"
import type { KpiSnapshot } from "@/lib/kpi.types"

export function useKpiData(pollIntervalMs = 60_000) {
  const [snapshots, setSnapshots] = useState<KpiSnapshot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (silent = false) => {
    try {
      const res = await fetch("/api/kpi", { cache: "no-store" })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error || `Error ${res.status}`)
      }
      const data = await res.json()
      setSnapshots(data.snapshots ?? [])
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load KPI data")
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(false)
    const interval = setInterval(() => fetchData(true), pollIntervalMs)
    return () => clearInterval(interval)
  }, [fetchData, pollIntervalMs])

  return { snapshots, loading, error, refetch: () => fetchData(false) }
}
