"use client"

import type { KpiSnapshot } from "@/lib/kpi.types"
import { KpiMetricTrendDialog } from "@/components/kpi/kpi-metric-trend-dialog"

interface KpiFolderTrendDialogProps {
  snapshots: KpiSnapshot[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KpiFolderTrendDialog({ snapshots, open, onOpenChange }: KpiFolderTrendDialogProps) {
  return (
    <KpiMetricTrendDialog
      snapshots={snapshots}
      open={open}
      onOpenChange={onOpenChange}
      title="Évolution des dossiers"
      description="Original_Folder et Translated_Folder par snapshot KPI — compteurs indépendants (chevauchement possible)."
      series={[
        { key: "originalFolder", label: "Original_Folder", color: "#b45309" },
        { key: "translatedFolder", label: "Translated_Folder", color: "#4338ca" },
      ]}
    />
  )
}
