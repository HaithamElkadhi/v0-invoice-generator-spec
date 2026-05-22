"use client"

import type { FinanceStats } from "@/lib/finance.types"
import {
  collectionRateColor,
  formatAmount,
  formatCurrencyPair,
} from "@/lib/finance.utils"
import { kpiCardStyle } from "@/components/finance/finance-styles"

interface FinanceKpiStripProps {
  stats: FinanceStats
}

export function FinanceKpiStrip({ stats }: FinanceKpiStripProps) {
  const rateColor = collectionRateColor(stats.collectionRate)

  const kpis = [
    {
      label: "Total encaissé",
      value: formatCurrencyPair(stats.totalEncaisse),
      sub: null,
    },
    {
      label: "À encaisser",
      value: formatCurrencyPair(stats.aEncaisser),
      sub: `${stats.pendingCount} ligne${stats.pendingCount !== 1 ? "s" : ""} en attente`,
    },
    {
      label: "Taux de collecte",
      value: `${stats.collectionRate} %`,
      sub: `${stats.statusBreakdown.find((s) => s.status === "Payé")?.count ?? 0} / ${stats.totalLines} lignes`,
      valueColor: rateColor,
    },
    {
      label: "Prospects payants",
      value: String(stats.payingProspectsCount),
      sub: `moy. ${formatAmount(stats.avgPerProspect.eur)} EUR · ${formatAmount(stats.avgPerProspect.tnd)} TND`,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} style={kpiCardStyle}>
          <p style={{ fontSize: 12, color: "#737373", margin: "0 0 6px" }}>{kpi.label}</p>
          <p
            style={{
              fontSize: 18,
              fontWeight: 600,
              margin: 0,
              color: kpi.valueColor ?? "#171717",
              lineHeight: 1.3,
            }}
          >
            {kpi.value}
          </p>
          {kpi.sub && (
            <p style={{ fontSize: 11, color: "#737373", margin: "6px 0 0" }}>{kpi.sub}</p>
          )}
        </div>
      ))}
    </div>
  )
}
