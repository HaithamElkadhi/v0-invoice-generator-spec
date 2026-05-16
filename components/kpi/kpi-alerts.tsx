import type { ComponentType } from "react"
import type { Alert } from "@/lib/kpi.types"
import { AlertCircle, CircleHelp, Euro, FileCheck, Flame, Star } from "lucide-react"

interface KpiAlertsProps {
  alerts: Alert[]
}

const ALERT_STYLES: Record<
  Alert["type"],
  { container: string; icon: ComponentType<{ className?: string }> }
> = {
  critical: { container: "border-rose-200 bg-rose-50", icon: Flame },
  warning: { container: "border-amber-200 bg-amber-50", icon: CircleHelp },
  success: { container: "border-emerald-200 bg-emerald-50", icon: Star },
  info: { container: "border-blue-200 bg-blue-50", icon: AlertCircle },
}

function resolveIcon(alert: Alert) {
  if (alert.icon === "flame") return Flame
  if (alert.icon === "user-question") return CircleHelp
  if (alert.icon === "file-check") return FileCheck
  if (alert.icon === "currency-euro") return Euro
  if (alert.icon === "star") return Star
  return AlertCircle
}

export function KpiAlerts({ alerts }: KpiAlertsProps) {
  if (alerts.length === 0) {
    return (
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Alertes business</h2>
        <p className="mt-2 text-sm text-slate-500">Aucune alerte pour ce snapshot.</p>
      </article>
    )
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-900">Alertes business</h2>
      <ul className="space-y-3">
        {alerts.map((alert) => {
          const style = ALERT_STYLES[alert.type]
          const Icon = resolveIcon(alert)
          return (
            <li
              key={alert.title}
              className={`flex gap-3 rounded-xl border p-4 ${style.container}`}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" />
              <div>
                <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                <p className="mt-1 text-sm text-slate-600">{alert.body}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </article>
  )
}
