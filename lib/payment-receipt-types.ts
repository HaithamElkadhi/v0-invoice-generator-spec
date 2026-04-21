import { COMPANY_INFO, type InvoiceCurrency, formatInvoiceCurrency } from "./invoice-types"

export type PaymentMethod =
  | "bank_transfer"
  | "cash"
  | "paypal"
  | "credit_card"
  | "mobile_money"
  | "other"

export interface PaymentReceiptData {
  invoiceId: string
  paymentDate: string
  paymentReason: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientAddress: string
  paymentMethod: PaymentMethod
  currency: InvoiceCurrency
  amount: number
  comment: string
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  bank_transfer: "Bank Transfer",
  cash: "Cash",
  paypal: "PayPal",
  credit_card: "Credit Card",
  mobile_money: "Mobile Money",
  other: "Other",
}

export function formatReceiptDate(dateStr: string): string {
  if (!dateStr) return "-"
  const [year, month, day] = dateStr.split("-")
  return day && month && year ? `${day}/${month}/${year}` : dateStr
}

export function buildReceiptHeadline(data: PaymentReceiptData): string {
  return data.invoiceId
    ? `Payment Receipt - Invoice ${data.invoiceId}`
    : `Payment Receipt - ${COMPANY_INFO.name}`
}

export function formatAmount(value: number, currency: InvoiceCurrency): string {
  return formatInvoiceCurrency(Number.isFinite(value) ? value : 0, currency)
}
