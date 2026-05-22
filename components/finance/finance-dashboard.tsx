"use client"

import { RefreshCw } from "lucide-react"
import { useFinanceData } from "@/hooks/use-finance-data"
import { FinanceKpiStrip } from "@/components/finance/finance-kpi-strip"
import { PaymentStatusPanel } from "@/components/finance/payment-status-panel"
import { ServicesBilledPanel } from "@/components/finance/services-billed-panel"
import { PaymentMethodsPanel } from "@/components/finance/payment-methods-panel"
import { CurrencySplitPanel } from "@/components/finance/currency-split-panel"
import { PaymentsOverTimeChart } from "@/components/finance/payments-over-time-chart"
import { financeCardStyle } from "@/components/finance/finance-styles"

export function FinanceDashboard() {
  const { stats, loading, error, lastUpdated, refetch } = useFinanceData()

  if (loading) {
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: "#737373" }}>
        Chargement des paiements Airtable…
      </div>
    )
  }

  if (error) {
    return (
      <article style={{ ...financeCardStyle, borderColor: "#fecaca", background: "#fef2f2" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#b91c1c" }}>{error}</p>
        <button
          type="button"
          onClick={() => void refetch()}
          style={{
            marginTop: 12,
            fontSize: 12,
            padding: "6px 12px",
            borderRadius: 8,
            border: "0.5px solid #e5e5e5",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Réessayer
        </button>
      </article>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <p style={{ margin: 0, fontSize: 12, color: "#737373" }}>
          {lastUpdated
            ? `Mis à jour ${lastUpdated.toLocaleString("fr-FR", {
                dateStyle: "short",
                timeStyle: "short",
              })}`
            : "Données live Airtable — Paiements"}
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            padding: "6px 10px",
            borderRadius: 8,
            border: "0.5px solid #e5e5e5",
            background: "#fff",
            cursor: "pointer",
            color: "#404040",
          }}
        >
          <RefreshCw style={{ width: 14, height: 14 }} />
          Actualiser
        </button>
      </div>

      <FinanceKpiStrip stats={stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PaymentStatusPanel stats={stats} />
        <ServicesBilledPanel stats={stats} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PaymentMethodsPanel stats={stats} />
        <CurrencySplitPanel stats={stats} />
      </div>

      <PaymentsOverTimeChart stats={stats} />
    </div>
  )
}
