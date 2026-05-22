"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { computeFinanceStats } from "@/lib/finance.utils"
import type { FinanceStats, PaiementRecord } from "@/lib/finance.types"

export function useFinanceData() {
  const [records, setRecords] = useState<PaiementRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async (silent = false) => {
    try {
      const res = await fetch("/api/paiements/fetch", { cache: "no-store" })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error || `Erreur ${res.status}`)
      }
      const data = await res.json()
      const paiements = Array.isArray(data.paiements) ? data.paiements : []
      setRecords(
        paiements.map((p: Record<string, unknown>) => ({
          id: String(p.id ?? ""),
          reference: String(p.reference ?? ""),
          fullName: Array.isArray(p.fullName) ? p.fullName.map(String) : [],
          prospectId: Array.isArray(p.prospectId) ? p.prospectId.map(String) : [],
          amount: String(p.amount ?? ""),
          currency: String(p.currency ?? ""),
          purpose: Array.isArray(p.purpose) ? p.purpose.map(String) : [],
          status: String(p.status ?? ""),
          dueDate: String(p.dueDate ?? ""),
          paymentDate: String(p.paymentDate ?? ""),
          paymentMethod: String(p.paymentMethod ?? ""),
        }))
      )
      setLastUpdated(new Date())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec du chargement des paiements")
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchData(false)
  }, [fetchData])

  const stats: FinanceStats | null = useMemo(
    () => (records.length > 0 || !loading ? computeFinanceStats(records) : null),
    [records, loading]
  )

  return {
    records,
    stats,
    loading,
    error,
    lastUpdated,
    refetch: () => fetchData(false),
  }
}
