export interface KpiSnapshot {
  id: string
  snapshotId: number
  createdAt: string
  totalProspect: number
  potential: number
  serious: number
  undecided: number
  engaged: number
  admitted: number
  completed: number
  lastChance: number
  lost: number
}

export interface KpiDelta {
  value: number
  direction: "up" | "down" | "stable"
}

export interface ConversionRate {
  label: string
  from: string
  to: string
  rate: number | null
  isCumulative: boolean
  health: "good" | "warn" | "critical" | "na"
}

export interface Alert {
  type: "critical" | "warning" | "success" | "info"
  title: string
  body: string
  icon: string
}
