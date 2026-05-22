"use client"

type BarItem = {
  key: string
  label: string
  count: number
  percent: number
  color: string
}

interface HorizontalBarListProps {
  items: BarItem[]
  barColor?: string
}

export function HorizontalBarList({ items, barColor = "#378ADD" }: HorizontalBarListProps) {
  const max = items[0]?.count ?? 1

  if (items.length === 0) {
    return <p style={{ fontSize: 13, color: "#737373", margin: 0 }}>Aucune donnée</p>
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((item) => {
        const width = max > 0 ? Math.max(4, (item.count / max) * 100) : 0
        const fill = item.color || barColor
        return (
          <div key={item.key}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 8,
                marginBottom: 4,
                fontSize: 12,
              }}
            >
              <span style={{ color: "#404040", flex: 1, minWidth: 0 }}>{item.label}</span>
              <span style={{ color: "#737373", whiteSpace: "nowrap" }}>
                {item.count} ({item.percent}%)
              </span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 4,
                background: "#f0f0f0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${width}%`,
                  height: "100%",
                  background: fill,
                  borderRadius: 4,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
