import type { Alert, ConversionRate, FolderInsight, KpiDelta, KpiSnapshot } from "@/lib/kpi.types"

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

/** Lost / Last chance share of total: >20% is bad, not good. */
export function getAtRiskShareHealthLabel(rate: number | null): "good" | "warn" | "critical" | "na" {
  if (rate === null) return "na"
  if (rate > 20) return "critical"
  if (rate > 10) return "warn"
  return "good"
}

export function computeFolderInsight(snap: KpiSnapshot): FolderInsight {
  return {
    originalVsEngaged: safeRate(snap.originalFolder, snap.engaged),
    translatedVsEngaged: safeRate(snap.translatedFolder, snap.engaged),
    translatedVsAdmitted: safeRate(snap.translatedFolder, snap.admitted),
    overlapFloor: Math.min(snap.originalFolder, snap.translatedFolder),
  }
}

function totalShareRate(
  snap: KpiSnapshot,
  numerator: number,
  healthFn: (rate: number | null) => ConversionRate["health"] = getHealthLabel
): Pick<ConversionRate, "rate" | "health"> {
  const rate = safeRate(numerator, snap.totalProspect)
  return { rate, health: healthFn(rate) }
}

export function computeConversionRates(snap: KpiSnapshot): ConversionRate[] {
  const admittedToEngaged = safeRate(snap.admitted, snap.engaged)
  const completedToAdmitted = safeRate(snap.completed, snap.admitted)

  const seriousShare = totalShareRate(snap, snap.serious)
  const undecidedShare = totalShareRate(snap, snap.undecided)
  const admittedShare = totalShareRate(snap, snap.admitted)
  const lostShare = totalShareRate(snap, snap.lost, getAtRiskShareHealthLabel)
  const lastChanceShare = totalShareRate(snap, snap.lastChance, getAtRiskShareHealthLabel)

  return [
    {
      label: "Serious / Total Prospect",
      from: "Serious",
      to: "Total Prospect",
      rate: seriousShare.rate,
      isCumulative: false,
      health: seriousShare.health,
    },
    {
      label: "Undecided / Total Prospect",
      from: "Undecided",
      to: "Total Prospect",
      rate: undecidedShare.rate,
      isCumulative: false,
      health: undecidedShare.health,
    },
    {
      label: "Admitted / Total Prospect",
      from: "Admitted",
      to: "Total Prospect",
      rate: admittedShare.rate,
      isCumulative: false,
      health: admittedShare.health,
    },
    {
      label: "Lost / Total Prospect",
      from: "Lost",
      to: "Total Prospect",
      rate: lostShare.rate,
      isCumulative: false,
      health: lostShare.health,
    },
    {
      label: "Last chance / Total Prospect",
      from: "Last chance",
      to: "Total Prospect",
      rate: lastChanceShare.rate,
      isCumulative: false,
      health: lastChanceShare.health,
    },
    {
      label: "Admitted / Engaged",
      from: "Engaged",
      to: "Admitted",
      rate: admittedToEngaged,
      isCumulative: false,
      health: getHealthLabel(admittedToEngaged),
    },
    {
      label: "Completed / Admitted",
      from: "Admitted",
      to: "Completed",
      rate: completedToAdmitted,
      isCumulative: false,
      health: getHealthLabel(completedToAdmitted),
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

  const folderInsight = computeFolderInsight(snap)
  if (snap.originalFolder > 0 || snap.translatedFolder > 0) {
    const vsEngaged =
      snap.engaged > 0 && folderInsight.translatedVsEngaged !== null
        ? `${folderInsight.translatedVsEngaged}% de ratio traduits/Engaged · ${folderInsight.originalVsEngaged ?? "—"}% originaux/Engaged.`
        : "Comparer aux Engaged dès qu’ils sont renseignés."
    const gap =
      snap.engaged > 0 && snap.translatedFolder < snap.engaged
        ? ` Écart : ${snap.engaged - snap.translatedFolder} Engaged de plus que de dossiers traduits (si 1 traduction par client).`
        : ""
    alerts.push({
      type:
        snap.engaged > 0 && snap.translatedFolder < snap.engaged ? "warning" : "info",
      title: `Dossiers : ${snap.originalFolder} original · ${snap.translatedFolder} traduit`,
      body: `Compteurs indépendants (chevauchement possible, min. ${folderInsight.overlapFloor} dans les deux). ${vsEngaged}${gap}`,
      icon: "languages",
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
