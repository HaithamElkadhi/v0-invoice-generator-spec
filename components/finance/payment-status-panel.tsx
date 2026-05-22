"use client"

import type { FinanceStats } from "@/lib/finance.types"
import { DEADLINE_LABEL, formatAmount } from "@/lib/finance.utils"
import { financeCardStyle, sectionTitleStyle } from "@/components/finance/finance-styles"

interface PaymentStatusPanelProps {
  stats: FinanceStats
}

export function PaymentStatusPanel({ stats }: PaymentStatusPanelProps) {
  return (
    <article style={financeCardStyle}>
      <h3 style={sectionTitleStyle}>Statut des paiements</h3>
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {stats.statusBreakdown.map((item) => (
          <div
            key={item.status}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 13,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: item.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: "#404040" }}>{item.status}</span>
            </div>
            <span style={{ color: "#737373" }}>
              {item.count} · {item.percent}%
            </span>
          </div>
        ))}
      </div>

      {stats.pendingWarning && (
        <div
          style={{
            marginTop: 16,
            padding: "10px 12px",
            borderRadius: 8,
            background: "#fef9ee",
            border: "0.5px solid #e8d4a8",
            fontSize: 12,
            color: "#7a5c14",
            lineHeight: 1.5,
          }}
        >
          Deadline: {DEADLINE_LABEL} — {stats.pendingWarning.count} paiement
          {stats.pendingWarning.count !== 1 ? "s" : ""} dus — {formatAmount(stats.pendingWarning.eur)}{" "}
          EUR + {formatAmount(stats.pendingWarning.tnd)} TND à récupérer
        </div>
      )}
    </article>
  )
}
