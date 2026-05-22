export type Currency = "EUR" | "TND"

export type PaymentStatus = "Payé" | "À payer"

export type PaiementRecord = {
  id: string
  reference: string
  fullName: string[]
  prospectId: string[]
  amount: string
  currency: string
  purpose: string[]
  status: string
  dueDate: string
  paymentDate: string
  paymentMethod: string
}

export type CurrencyTotals = {
  eur: number
  tnd: number
}

export type StatusBreakdownItem = {
  status: PaymentStatus
  count: number
  percent: number
  color: string
}

export type PurposeBarItem = {
  label: string
  count: number
  percent: number
  color: string
}

export type PaymentMethodBarItem = {
  method: string
  count: number
  percent: number
}

export type CurrencyBreakdownItem = {
  currency: Currency
  dotColor: string
  paid: number
  pending: number
  collectionRate: number
}

export type MonthlyPaymentPoint = {
  key: string
  label: string
  eur: number
  tnd: number
}

export type FinanceStats = {
  totalEncaisse: CurrencyTotals
  aEncaisser: CurrencyTotals
  pendingCount: number
  collectionRate: number
  payingProspectsCount: number
  avgPerProspect: CurrencyTotals
  statusBreakdown: StatusBreakdownItem[]
  pendingWarning: {
    count: number
    eur: number
    tnd: number
  } | null
  purposeBars: PurposeBarItem[]
  paymentMethodBars: PaymentMethodBarItem[]
  currencyBreakdown: CurrencyBreakdownItem[]
  monthlySeries: MonthlyPaymentPoint[]
  timeSummary: {
    totalTnd: number
    totalEur: number
    peakTnd: { value: number; month: string }
    peakEur: { value: number; month: string }
  }
  totalLines: number
}
