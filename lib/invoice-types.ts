export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export type InvoiceCurrency = "EUR" | "USD" | "TND"

export interface PaymentMethodsSelection {
  paypal: boolean
  bankTransfer: boolean
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

export const PAYPAL_EMAIL = "contact@jeexpert-study.com" as const

export const BANK_DETAILS = {
  accountHolder: "Haitham ELKADHI",
  codiceFiscale: "LKDHHM94E25Z352S",
  iban: "IT70 Y030 6915 2241 0000 0008 290",
  bic: "BCITITMM",
  bank: "Intesa Sanpaolo",
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
