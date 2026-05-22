"use client"

import type { FinanceStats } from "@/lib/finance.types"
import { financeCardStyle, sectionTitleStyle } from "@/components/finance/finance-styles"
import { HorizontalBarList } from "@/components/finance/horizontal-bar-list"

interface ServicesBilledPanelProps {
  stats: FinanceStats
}

export function ServicesBilledPanel({ stats }: ServicesBilledPanelProps) {
  const items = stats.purposeBars.map((p) => ({
    key: p.label,
    label: p.label,
    count: p.count,
    percent: p.percent,
    color: p.color,
  }))

  return (
    <article style={financeCardStyle}>
      <h3 style={sectionTitleStyle}>Services facturés</h3>
      <div style={{ marginTop: 16 }}>
        <HorizontalBarList items={items} />
      </div>
    </article>
  )
}
