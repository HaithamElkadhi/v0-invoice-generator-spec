"use client"

import { useCallback, useEffect, useState } from "react"
import type { ApplicationRecord } from "@/lib/application.types"

export function useApplicationsData(pollIntervalMs = 60_000) {
  const [records, setRecords] = useState<ApplicationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (silent = false) => {
    try {
      const res = await fetch("/api/applications", { cache: "no-store" })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error || `Error ${res.status}`)
      }
      const data = await res.json()
      setRecords(data.records ?? [])
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load applications")
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(false)
    const interval = setInterval(() => fetchData(true), pollIntervalMs)
    return () => clearInterval(interval)
  }, [fetchData, pollIntervalMs])

  return { records, loading, error, refetch: () => fetchData(false) }
}
