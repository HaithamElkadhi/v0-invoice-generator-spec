export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export type InvoiceCurrency = "EUR" | "USD" | "TND"

export interface PaymentMethodsSelection {
  bankTransferItaly: boolean
  bankTransferTunisia: boolean
  other: boolean
}

export interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  currency: InvoiceCurrency
  clientName: string
  clientEmail: string
  clientAddress: string
  items: InvoiceItem[]
  discountEnabled: boolean
  discountPercentage: number
  discountReason: string
  paymentMethods: PaymentMethodsSelection
}

export interface InvoiceDataWithTotals extends InvoiceData {
  subtotal: number
  discountAmount: number
  finalTotal: number
}

import { getPictureUrl, PICTURE_LABELS } from "./pictures"

export const COMPANY_INFO = {
  name: "Jeexpert",
  email: "contact@jeexpert-study.com",
  phone: "+39 352 088 0880",
  website: "www.jeexpert-study.com",
  logoUrl: getPictureUrl(PICTURE_LABELS.LogoApp),
} as const

/** Intesa Sanpaolo (Italy) */
export const BANK_DETAILS_IT = {
  accountHolder: "Haitham ELKADHI",
  codiceFiscale: "LKDHHM94E25Z352S",
  iban: "IT70 Y030 6915 2241 0000 0008 290",
  bic: "BCITITMM",
  bank: "Intesa Sanpaolo",
} as const

/** Tunisia (TND) — ABC Bank */
export const BANK_DETAILS_TN = {
  bank: "ABC Bank",
  accountType: "Compte courant en TND",
  beneficiary: "SOCIETE JEEXPERT",
  address: "Rue du Lac Annecy, Lac I",
  rib: "28000043081100000186",
  iban: "TN5928000043081100000186",
  swiftBic: "ABCOTNTT001",
} as const

export const BRAND_COLORS = {
  primary: { r: 41, g: 84, b: 144 },
  accent: { r: 220, g: 53, b: 69 },
} as const

export const CURRENCY_OPTIONS: { value: InvoiceCurrency; label: string }[] = [
  { value: "EUR", label: "Euro (EUR)" },
  { value: "USD", label: "Dollar (USD)" },
  { value: "TND", label: "Dinar tunisien (TND)" },
]

export function formatInvoiceCurrency(amount: number, currency: InvoiceCurrency): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
  }).format(amount)
}
