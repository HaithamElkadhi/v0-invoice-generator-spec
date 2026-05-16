import type { KpiDelta } from "@/lib/kpi.types"
import { deltaColorClass, formatDeltaLabel } from "@/lib/kpi.utils"

interface KpiDeltaProps {
  delta: KpiDelta
  invert?: boolean
  className?: string
}

export function KpiDeltaDisplay({ delta, invert = false, className = "" }: KpiDeltaProps) {
  return (
    <p className={`text-xs font-medium ${deltaColorClass(delta, invert)} ${className}`}>
      {formatDeltaLabel(delta)}
    </p>
  )
}
