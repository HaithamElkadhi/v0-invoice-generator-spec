"use client"

import { useMemo } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js"
import { Line } from "react-chartjs-2"
import type { FinanceStats } from "@/lib/finance.types"
import { formatAmount } from "@/lib/finance.utils"
import { financeCardStyle, kpiCardStyle, sectionTitleStyle } from "@/components/finance/finance-styles"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend)

interface PaymentsOverTimeChartProps {
  stats: FinanceStats
}

export function PaymentsOverTimeChart({ stats }: PaymentsOverTimeChartProps) {
  const labels = stats.monthlySeries.map((p) => p.label)

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "TND",
          data: stats.monthlySeries.map((p) => p.tnd),
          borderColor: "#1D9E75",
          backgroundColor: "rgba(29,158,117,0.08)",
          fill: true,
          tension: 0.35,
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2,
        },
        {
          label: "EUR",
          data: stats.monthlySeries.map((p) => p.eur),
          borderColor: "#378ADD",
          backgroundColor: "rgba(55,138,221,0.06)",
          fill: true,
          tension: 0.35,
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2,
          borderDash: [6, 3],
        },
      ],
    }),
    [labels, stats.monthlySeries]
  )

  const options: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: (ctx) => {
              const value = ctx.parsed.y ?? 0
              return `${ctx.dataset.label}: ${formatAmount(value)}`
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 }, color: "#737373" },
        },
        y: {
          grid: { color: "#f0f0f0" },
          ticks: {
            font: { size: 11 },
            color: "#737373",
            callback: (v) => formatAmount(Number(v)),
          },
        },
      },
    }),
    []
  )

  const summaryCards = [
    { label: "Total TND", value: `${formatAmount(stats.timeSummary.totalTnd)} TND` },
    { label: "Total EUR", value: `${formatAmount(stats.timeSummary.totalEur)} EUR` },
    {
      label: "Pic TND",
      value: `${formatAmount(stats.timeSummary.peakTnd.value)} TND`,
      sub: stats.timeSummary.peakTnd.month,
    },
    {
      label: "Pic EUR",
      value: `${formatAmount(stats.timeSummary.peakEur.value)} EUR`,
      sub: stats.timeSummary.peakEur.month,
    },
  ]

  return (
    <article style={financeCardStyle}>
      <h3 style={sectionTitleStyle}>Paiements dans le temps</h3>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginTop: 12,
          marginBottom: 8,
          fontSize: 12,
        }}
        aria-label="Légende du graphique"
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 12, height: 12, background: "#1D9E75", borderRadius: 2 }} />
          TND
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 12,
              height: 12,
              background: "#378ADD",
              borderRadius: 2,
              opacity: 0.85,
            }}
          />
          EUR (pointillé)
        </span>
      </div>

      <div style={{ height: 280, marginTop: 8 }}>
        {stats.monthlySeries.length === 0 ? (
          <p style={{ fontSize: 13, color: "#737373", padding: "2rem 0", textAlign: "center" }}>
            Aucun paiement encaissé avec date de règlement
          </p>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" style={{ marginTop: 16 }}>
        {summaryCards.map((card) => (
          <div key={card.label} style={kpiCardStyle}>
            <p style={{ fontSize: 11, color: "#737373", margin: "0 0 4px" }}>{card.label}</p>
            <p style={{ fontSize: 15, fontWeight: 600, margin: 0, color: "#171717" }}>{card.value}</p>
            {card.sub && (
              <p style={{ fontSize: 11, color: "#737373", margin: "4px 0 0" }}>{card.sub}</p>
            )}
          </div>
        ))}
      </div>
    </article>
  )
}
