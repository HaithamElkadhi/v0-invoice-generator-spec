"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { ArrowLeft, BarChart3, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  lastUpdated: string
  onRefresh: () => void
  refreshing?: boolean
}

export function DashboardHeader({ lastUpdated, onRefresh, refreshing }: DashboardHeaderProps) {
  const formatted = lastUpdated
    ? format(new Date(lastUpdated), "d MMMM yyyy 'à' HH:mm", { locale: fr })
    : "—"

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <Link
          href="/"
          className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          aria-label="Retour aux modules"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#163867] to-[#1f4f8f] text-white shadow-sm">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">JEExpert — KPI Dashboard</h1>
            <p className="mt-0.5 text-sm text-slate-500">Mis à jour le {formatted}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 text-xs text-slate-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Polling actif (60s)
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>
    </div>
  )
}
