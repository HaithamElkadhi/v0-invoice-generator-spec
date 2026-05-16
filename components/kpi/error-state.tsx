"use client"

import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-12 text-center">
      <AlertTriangle className="mb-4 h-12 w-12 text-rose-500" />
      <h2 className="text-lg font-semibold text-slate-900">Impossible de charger les KPI</h2>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
      <p className="mt-2 text-xs text-slate-500">
        Vérifiez que <code className="rounded bg-slate-100 px-1">AIRTABLE_TOKEN</code>,{" "}
        <code className="rounded bg-slate-100 px-1">AIRTABLE_BASE_ID_2</code> et{" "}
        <code className="rounded bg-slate-100 px-1">AIRTABLE_KPI_TABLE_ID</code> /{" "}
        <code className="rounded bg-slate-100 px-1">AIRTABLE_APPLICATIONS_TABLE_ID</code> sont définis
        dans .env.local
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={onRetry}>Réessayer</Button>
        <Button variant="outline" asChild>
          <Link href="/">Retour au dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
