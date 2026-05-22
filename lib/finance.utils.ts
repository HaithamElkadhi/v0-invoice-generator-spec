import type {
  Currency,
  CurrencyTotals,
  FinanceStats,
  MonthlyPaymentPoint,
  PaiementRecord,
  PaymentStatus,
} from "@/lib/finance.types"

const STATUS_COLORS: Record<PaymentStatus, string> = {
  Payé: "#1D9E75",
  "À payer": "#BA7517",
}

const PURPOSE_COLORS: Record<string, string> = {
  "Frais de service initial": "#378ADD",
  "Frais université": "#7F77DD",
  "Frais d'acceptation université": "#1D9E75",
}

const DEFAULT_PURPOSE_COLOR = "#94a3b8"
const DEADLINE_LABEL = "30 mai 2026"

const MONTH_LABELS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
] as const

export function formatAmount(value: number): string {
  return value.toLocaleString("fr-FR", { maximumFractionDigits: 2 })
}

export function formatCurrencyPair(totals: CurrencyTotals): string {
  return `${formatAmount(totals.eur)} EUR · ${formatAmount(totals.tnd)} TND`
}

export function parseAmount(raw: string): number {
  if (!raw) return 0
  const normalized = raw.replace(/\s/g, "").replace(",", ".")
  const n = parseFloat(normalized)
  return Number.isFinite(n) ? n : 0
}

function isCurrency(value: string): value is Currency {
  return value === "EUR" || value === "TND"
}

function isStatus(value: string): value is PaymentStatus {
  return value === "Payé" || value === "À payer"
}

function emptyTotals(): CurrencyTotals {
  return { eur: 0, tnd: 0 }
}

function addToTotals(totals: CurrencyTotals, currency: Currency, amount: number) {
  if (currency === "EUR") totals.eur += amount
  else totals.tnd += amount
}

function firstProspectId(record: PaiementRecord): string | null {
  const id = record.prospectId.find(Boolean)
  return id ?? null
}

function monthKeyFromDate(iso: string): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
}

function monthLabel(key: string): string {
  const [year, month] = key.split("-")
  const idx = parseInt(month, 10) - 1
  const shortYear = year.slice(-2)
  const name = MONTH_LABELS[idx] ?? month
  return `${name} ${shortYear}`
}

function collectionRateColor(rate: number): string {
  return rate >= 70 ? "#1D9E75" : "#BA7517"
}

export { collectionRateColor, DEADLINE_LABEL, STATUS_COLORS, PURPOSE_COLORS }

export function computeFinanceStats(records: PaiementRecord[]): FinanceStats {
  const totalEncaisse = emptyTotals()
  const aEncaisser = emptyTotals()
  let paidCount = 0
  let pendingCount = 0

  const statusCounts: Record<PaymentStatus, number> = { Payé: 0, "À payer": 0 }
  const purposeCounts = new Map<string, number>()
  const methodCounts = new Map<string, number>()
  const paidByCurrency: Record<Currency, number> = { EUR: 0, TND: 0 }
  const pendingByCurrency: Record<Currency, number> = { EUR: 0, TND: 0 }
  const linesByCurrency: Record<Currency, number> = { EUR: 0, TND: 0 }
  const paidLinesByCurrency: Record<Currency, number> = { EUR: 0, TND: 0 }

  const prospectPaidTotals = new Map<string, CurrencyTotals>()
  const monthlyMap = new Map<string, CurrencyTotals>()

  for (const record of records) {
    const amount = parseAmount(record.amount)
    const currency = isCurrency(record.currency) ? record.currency : null
    const status = isStatus(record.status) ? record.status : null

    if (currency) {
      linesByCurrency[currency] += 1
    }

    if (status === "Payé") {
      paidCount += 1
      if (currency) {
        addToTotals(totalEncaisse, currency, amount)
        paidByCurrency[currency] += amount
        paidLinesByCurrency[currency] += 1

        const pid = firstProspectId(record)
        if (pid) {
          const existing = prospectPaidTotals.get(pid) ?? emptyTotals()
          addToTotals(existing, currency, amount)
          prospectPaidTotals.set(pid, existing)
        }
      }

      const method = record.paymentMethod?.trim() || "Non renseigné"
      methodCounts.set(method, (methodCounts.get(method) ?? 0) + 1)

      if (record.paymentDate) {
        const key = monthKeyFromDate(record.paymentDate)
        if (key && currency) {
          const bucket = monthlyMap.get(key) ?? emptyTotals()
          addToTotals(bucket, currency, amount)
          monthlyMap.set(key, bucket)
        }
      }
    } else if (status === "À payer") {
      pendingCount += 1
      if (currency) {
        addToTotals(aEncaisser, currency, amount)
        pendingByCurrency[currency] += amount
      }
    }

    if (status) {
      statusCounts[status] += 1
    }

    for (const purpose of record.purpose) {
      const label = purpose.trim()
      if (!label) continue
      purposeCounts.set(label, (purposeCounts.get(label) ?? 0) + 1)
    }
  }

  const totalLines = records.length
  const collectionRate = totalLines > 0 ? Math.round((paidCount / totalLines) * 100) : 0

  const payingProspectsCount = prospectPaidTotals.size
  const avgPerProspect = emptyTotals()
  if (payingProspectsCount > 0) {
    for (const totals of prospectPaidTotals.values()) {
      avgPerProspect.eur += totals.eur
      avgPerProspect.tnd += totals.tnd
    }
    avgPerProspect.eur /= payingProspectsCount
    avgPerProspect.tnd /= payingProspectsCount
  }

  const statusBreakdown = (["Payé", "À payer"] as PaymentStatus[]).map((status) => ({
    status,
    count: statusCounts[status],
    percent: totalLines > 0 ? Math.round((statusCounts[status] / totalLines) * 100) : 0,
    color: STATUS_COLORS[status],
  }))

  const purposeTotal = Array.from(purposeCounts.values()).reduce((a, b) => a + b, 0)
  const purposeBars = Array.from(purposeCounts.entries())
    .map(([label, count]) => ({
      label,
      count,
      percent: purposeTotal > 0 ? Math.round((count / purposeTotal) * 100) : 0,
      color: PURPOSE_COLORS[label] ?? DEFAULT_PURPOSE_COLOR,
    }))
    .sort((a, b) => b.count - a.count)

  const methodTotal = Array.from(methodCounts.values()).reduce((a, b) => a + b, 0)
  const paymentMethodBars = Array.from(methodCounts.entries())
    .map(([method, count]) => ({
      method,
      count,
      percent: methodTotal > 0 ? Math.round((count / methodTotal) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  const currencyBreakdown = (["EUR", "TND"] as Currency[]).map((currency) => {
    const paid = paidByCurrency[currency]
    const pending = pendingByCurrency[currency]
    const lines = linesByCurrency[currency]
    const paidLines = paidLinesByCurrency[currency]
    const rate = lines > 0 ? Math.round((paidLines / lines) * 100) : 0
    return {
      currency,
      dotColor: currency === "EUR" ? "#378ADD" : "#1D9E75",
      paid,
      pending,
      collectionRate: rate,
    }
  })

  const monthlySeries: MonthlyPaymentPoint[] = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, totals]) => ({
      key,
      label: monthLabel(key),
      eur: totals.eur,
      tnd: totals.tnd,
    }))

  let peakTnd = { value: 0, month: "—" }
  let peakEur = { value: 0, month: "—" }
  let totalTnd = 0
  let totalEur = 0

  for (const point of monthlySeries) {
    totalTnd += point.tnd
    totalEur += point.eur
    if (point.tnd > peakTnd.value) {
      peakTnd = { value: point.tnd, month: point.label }
    }
    if (point.eur > peakEur.value) {
      peakEur = { value: point.eur, month: point.label }
    }
  }

  const pendingWarning =
    pendingCount > 0
      ? {
          count: pendingCount,
          eur: aEncaisser.eur,
          tnd: aEncaisser.tnd,
        }
      : null

  return {
    totalEncaisse,
    aEncaisser,
    pendingCount,
    collectionRate,
    payingProspectsCount,
    avgPerProspect,
    statusBreakdown,
    pendingWarning,
    purposeBars,
    paymentMethodBars,
    currencyBreakdown,
    monthlySeries,
    timeSummary: {
      totalTnd,
      totalEur,
      peakTnd,
      peakEur,
    },
    totalLines,
  }
}
