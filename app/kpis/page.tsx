import type { Metadata } from "next"
import { KpisDashboard } from "@/components/kpi/kpis-dashboard"

export const metadata: Metadata = {
  title: "KPIs — JEEXPERT ERP",
  description: "Dashboard KPI temps réel — admission et candidatures",
}

export default function KpisPage() {
  return <KpisDashboard />
}
