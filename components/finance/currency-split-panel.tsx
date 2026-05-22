"use client"

import type { FinanceStats } from "@/lib/finance.types"
import { collectionRateColor, formatAmount } from "@/lib/finance.utils"
import { financeCardStyle, sectionTitleStyle } from "@/components/finance/finance-styles"

interface CurrencySplitPanelProps {
  stats: FinanceStats
}

export function CurrencySplitPanel({ stats }: CurrencySplitPanelProps) {
  return (
    <article style={financeCardStyle}>
      <h3 style={sectionTitleStyle}>Répartition devises</h3>
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
        {stats.currencyBreakdown.map((row) => {
          const rateColor = collectionRateColor(row.collectionRate)
          return (
            <div
              key={row.currency}
              style={{
                paddingBottom: 16,
                borderBottom:
                  row.currency === "EUR" ? "0.5px solid #f0f0f0" : undefined,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: row.dotColor,
                  }}
                />
                <span style={{ fontSize: 13, fontWeight: 500, color: "#171717" }}>{row.currency}</span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  fontSize: 12,
                  color: "#525252",
                }}
              >
                <div>
                  <span style={{ color: "#737373" }}>Encaissé</span>
                  <p style={{ margin: "2px 0 0", fontWeight: 600, color: "#171717" }}>
                    {formatAmount(row.paid)} {row.currency}
                  </p>
                </div>
                <div>
                  <span style={{ color: "#737373" }}>À encaisser</span>
                  <p style={{ margin: "2px 0 0", fontWeight: 600, color: "#171717" }}>
                    {formatAmount(row.pending)} {row.currency}
                  </p>
                </div>
              </div>
              <p style={{ margin: "10px 0 0", fontSize: 12 }}>
                <span style={{ color: "#737373" }}>Taux de collecte </span>
                <span style={{ fontWeight: 600, color: rateColor }}>{row.collectionRate} %</span>
              </p>
            </div>
          )
        })}
      </div>
    </article>
  )
}
