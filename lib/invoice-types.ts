export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface PaymentMethodsSelection {
  paypal: boolean
  cash: boolean
  bankTransfer: boolean
}

export interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  clientName: string
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

export const COMPANY_INFO = {
  name: "Jeexpert",
  email: "study@jeexpert.com",
  phone: "+39 352 088 0880",
  website: "www.jeexpert-study.com",
  logoUrl: "/images/jeexpert-20logo-20inversed.png",
} as const

export const BANK_DETAILS = {
  iban: "IT66B0501803400000017104738",
  swift: "ETICIT22009",
  bank: "Banca Popolare Etica - Napoli",
} as const

export const BRAND_COLORS = {
  primary: { r: 41, g: 84, b: 144 },
  accent: { r: 220, g: 53, b: 69 },
} as const
