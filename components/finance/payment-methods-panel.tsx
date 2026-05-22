"use client"

import type { FinanceStats } from "@/lib/finance.types"
import { financeCardStyle, sectionTitleStyle } from "@/components/finance/finance-styles"
import { HorizontalBarList } from "@/components/finance/horizontal-bar-list"

interface PaymentMethodsPanelProps {
  stats: FinanceStats
}

export function PaymentMethodsPanel({ stats }: PaymentMethodsPanelProps) {
  const items = stats.paymentMethodBars.map((m) => ({
    key: m.method,
    label: m.method,
    count: m.count,
    percent: m.percent,
    color: "#378ADD",
  }))

  return (
    <article style={financeCardStyle}>
      <h3 style={sectionTitleStyle}>Méthodes de paiement</h3>
      <p style={{ fontSize: 11, color: "#737373", margin: "4px 0 0" }}>Enregistrements Payé uniquement</p>
      <div style={{ marginTop: 16 }}>
        <HorizontalBarList items={items} barColor="#378ADD" />
      </div>
    </article>
  )
}
