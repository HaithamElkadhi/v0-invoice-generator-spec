"use client"

import { FinanceDashboard } from "@/components/finance/finance-dashboard"

export function FinanceSection() {
  return (
    <section>
      <header style={{ marginBottom: 16 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
            color: "#171717",
          }}
        >
          Finance — Paiements
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#737373" }}>
          Tableau de bord encaissements (base Airtable Paiements)
        </p>
      </header>
      <FinanceDashboard />
    </section>
  )
}
