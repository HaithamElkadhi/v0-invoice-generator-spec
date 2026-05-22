import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Wallet } from "lucide-react"
import { FinanceDashboard } from "@/components/finance/finance-dashboard"

export const metadata: Metadata = {
  title: "Finance — JEEXPERT ERP",
  description: "Tableau de bord encaissements — Paiements Airtable",
}

export default function FinancePage() {
  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex items-start gap-4">
          <Link
            href="/"
            className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            aria-label="Retour"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1D9E75] to-[#378ADD] text-white shadow-sm">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Finance Dashboard</h1>
              <p className="text-sm text-slate-500">Paiements — live Airtable</p>
            </div>
          </div>
        </div>
        <FinanceDashboard />
      </div>
    </div>
  )
}
