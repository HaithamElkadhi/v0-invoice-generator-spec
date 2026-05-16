import type { Alert, ConversionRate, KpiDelta, KpiSnapshot } from "@/lib/kpi.types"

export function getDelta(current: number, previous: number): KpiDelta {
  const diff = current - previous
  return {
    value: diff,
    direction: diff > 0 ? "up" : diff < 0 ? "down" : "stable",
  }
}

export function safeRate(numerator: number, denominator: number): number | null {
  if (denominator === 0) return null
  return Math.round((numerator / denominator) * 1000) / 10
}

export function getHealthLabel(rate: number | null): "good" | "warn" | "critical" | "na" {
  if (rate === null) return "na"
  if (rate >= 50) return "good"
  if (rate >= 25) return "warn"
  return "critical"
}

export function computeConversionRates(snap: KpiSnapshot): ConversionRate[] {
  const engagedToAdmitted = safeRate(snap.admitted, snap.engaged)
  const admittedToCompleted = safeRate(snap.completed, snap.admitted)
  const engagedToCompleted = safeRate(snap.completed, snap.engaged)
  const totalToEngaged = safeRate(snap.engaged, snap.totalProspect)
  const totalToCompleted = safeRate(snap.completed, snap.totalProspect)
  const churnRate = safeRate(snap.lost + snap.lastChance, snap.totalProspect)

  return [
    {
      label: "Potential → Serious",
      from: "Potential",
      to: "Serious",
      rate:
        snap.potential > 0 && snap.serious <= snap.potential
          ? safeRate(snap.serious, snap.potential)
          : null,
      isCumulative: true,
      health: "na",
    },
    {
      label: "Serious → Engaged",
      from: "Serious",
      to: "Engaged",
      rate:
        snap.serious > 0 && snap.engaged <= snap.serious
          ? safeRate(snap.engaged, snap.serious)
          : null,
      isCumulative: true,
      health: "na",
    },
    {
      label: "Engaged → Admitted",
      from: "Engaged",
      to: "Admitted",
      rate: engagedToAdmitted,
      isCumulative: false,
      health: getHealthLabel(engagedToAdmitted),
    },
    {
      label: "Admitted → Completed",
      from: "Admitted",
      to: "Completed",
      rate: admittedToCompleted,
      isCumulative: false,
      health: getHealthLabel(admittedToCompleted),
    },
    {
      label: "Engaged → Completed",
      from: "Engaged",
      to: "Completed",
      rate: engagedToCompleted,
      isCumulative: false,
      health: getHealthLabel(engagedToCompleted),
    },
    {
      label: "Total → Engaged",
      from: "Total",
      to: "Engaged",
      rate: totalToEngaged,
      isCumulative: false,
      health: getHealthLabel(totalToEngaged),
    },
    {
      label: "Total → Completed",
      from: "Total",
      to: "Completed",
      rate: totalToCompleted,
      isCumulative: false,
      health: getHealthLabel(totalToCompleted),
    },
    {
      label: "Churn global (Lost+LC / Total)",
      from: "Total",
      to: "Lost+LC",
      rate: churnRate,
      isCumulative: false,
      health: getHealthLabel(churnRate === null ? null : 100 - churnRate),
    },
  ]
}

export function generateAlerts(snap: KpiSnapshot, _prev?: KpiSnapshot): Alert[] {
  const alerts: Alert[] = []

  if (snap.lastChance >= 30) {
    alerts.push({
      type: "critical",
      title: `${snap.lastChance} Last chance — action immédiate requise`,
      body: `Sans relance ciblée cette semaine, ils rejoignent les ${snap.lost} Lost. Churn total potentiel : ${snap.lost + snap.lastChance}/${snap.totalProspect}.`,
      icon: "flame",
    })
  }

  if (snap.undecided > 0) {
    alerts.push({
      type: "warning",
      title: `${snap.undecided} Undecided — fenêtre de conversion courte`,
      body: "Appel direct ou offre spéciale pour basculer en Engaged avant qu'ils deviennent Last chance.",
      icon: "user-question",
    })
  }

  const waitingAdmission = snap.engaged - snap.admitted
  if (waitingAdmission > 0) {
    alerts.push({
      type: "warning",
      title: `${waitingAdmission} Engaged en attente d'admission`,
      body: "Vérifier deadlines et statuts de candidature pour chaque dossier universitaire en cours.",
      icon: "file-check",
    })
  }

  const waitingCompletion = snap.admitted - snap.completed
  if (waitingCompletion > 0) {
    alerts.push({
      type: "success",
      title: `${waitingCompletion} Admitted non Completed — revenus quasi-acquis`,
      body: "Relance douce pour les frais finaux. Conversion quasi-certaine.",
      icon: "currency-euro",
    })
  }

  if (snap.completed > 0) {
    alerts.push({
      type: "success",
      title: `${snap.completed} Completed — cibles upsell`,
      body: "Proposer logement, visa, préparation linguistique ou orientation master 2.",
      icon: "star",
    })
  }

  return alerts
}

export function formatDeltaLabel(delta: KpiDelta): string {
  if (delta.direction === "stable") return "= stable"
  const sign = delta.value > 0 ? "+" : ""
  const arrow = delta.direction === "up" ? "↑" : "↓"
  return `${arrow} ${sign}${delta.value}`
}

export function deltaColorClass(delta: KpiDelta, invert = false): string {
  if (delta.direction === "stable") return "text-slate-500"
  const positive = delta.direction === "up"
  const good = invert ? !positive : positive
  return good ? "text-emerald-600" : "text-rose-600"
}
