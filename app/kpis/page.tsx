import type { Metadata } from "next"
import { AdmissionDashboard } from "@/components/kpi/admission-dashboard"

export const metadata: Metadata = {
  title: "KPIs — JEEXPERT ERP",
  description: "Dashboard KPI temps réel — pipeline admission",
}

export default function KpisPage() {
  return <AdmissionDashboard />
}
