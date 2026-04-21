"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Download, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CURRENCY_OPTIONS,
  type InvoiceCurrency,
} from "@/lib/invoice-types"
import { getPictureUrl, PICTURE_LABELS } from "@/lib/pictures"
import { generatePaymentReceiptPDF } from "@/lib/payment-receipt-pdf"
import { buildPaymentReceiptEmailBody } from "@/lib/payment-receipt-email-body"
import {
  PAYMENT_METHOD_LABELS,
  buildReceiptHeadline,
  type PaymentMethod,
  type PaymentReceiptData,
} from "@/lib/payment-receipt-types"

const FROM_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "contact", label: "Contact" },
  { value: "italy", label: "Italy" },
] as const

const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = Object.entries(
  PAYMENT_METHOD_LABELS
).map(([value, label]) => ({ value: value as PaymentMethod, label }))

const initialData: PaymentReceiptData = {
  invoiceId: "",
  paymentDate: new Date().toISOString().split("T")[0],
  paymentReason: "",
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  clientAddress: "",
  paymentMethod: "bank_transfer",
  currency: "EUR",
  amount: 0,
  comment: "",
}

const RECEIPT_PREFILL_STORAGE_KEY = "payment-receipt-prefill-v1"

function isValidCurrency(value: unknown): value is InvoiceCurrency {
  return value === "EUR" || value === "USD" || value === "TND"
}

function isValidPaymentMethod(value: unknown): value is PaymentMethod {
  return (
    value === "bank_transfer" ||
    value === "cash" ||
    value === "paypal" ||
    value === "credit_card" ||
    value === "mobile_money" ||
    value === "other"
  )
}

function parsePrefillData(value: unknown): PaymentReceiptData | null {
  if (!value || typeof value !== "object") return null
  const obj = value as Record<string, unknown>
  return {
    invoiceId: typeof obj.invoiceId === "string" ? obj.invoiceId : "",
    paymentDate:
      typeof obj.paymentDate === "string" && obj.paymentDate
        ? obj.paymentDate
        : new Date().toISOString().split("T")[0],
    paymentReason: typeof obj.paymentReason === "string" ? obj.paymentReason : "",
    clientName: typeof obj.clientName === "string" ? obj.clientName : "",
    clientEmail: typeof obj.clientEmail === "string" ? obj.clientEmail : "",
    clientPhone: typeof obj.clientPhone === "string" ? obj.clientPhone : "",
    clientAddress: typeof obj.clientAddress === "string" ? obj.clientAddress : "",
    paymentMethod: isValidPaymentMethod(obj.paymentMethod) ? obj.paymentMethod : "other",
    currency: isValidCurrency(obj.currency) ? obj.currency : "EUR",
    amount: typeof obj.amount === "number" && Number.isFinite(obj.amount) ? Math.max(0, obj.amount) : 0,
    comment: typeof obj.comment === "string" ? obj.comment : "",
  }
}

function parsePositiveNumber(value: string): number {
  if (!value.trim()) return 0
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

export default function PaymentReceiptPage() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<PaymentReceiptData>(initialData)
  const [isGenerating, setIsGenerating] = useState(false)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [emailPreviewHtml, setEmailPreviewHtml] = useState<string | null>(null)
  const [emailForm, setEmailForm] = useState({
    fromKey: "default" as "default" | "contact" | "italy",
    subject: "",
    cc: "",
    bcc: "",
  })

  const updateData = (updates: Partial<PaymentReceiptData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  useEffect(() => {
    if (searchParams.get("prefill") !== "1") return
    try {
      const raw = window.localStorage.getItem(RECEIPT_PREFILL_STORAGE_KEY)
      if (!raw) return
      const parsed = parsePrefillData(JSON.parse(raw))
      if (!parsed) return
      setData(parsed)
      window.localStorage.removeItem(RECEIPT_PREFILL_STORAGE_KEY)
    } catch (error) {
      console.error("Failed to prefill payment receipt form:", error)
    }
  }, [searchParams])

  const validateForReceipt = () => {
    if (!data.clientName.trim()) {
      alert("Please enter a client name")
      return false
    }
    if (!data.paymentReason.trim()) {
      alert("Please enter motif of paiement")
      return false
    }
    if (data.amount <= 0) {
      alert("Please enter montant")
      return false
    }
    return true
  }

  const handleGeneratePDF = async () => {
    if (!validateForReceipt()) return
    setIsGenerating(true)
    try {
      await generatePaymentReceiptPDF(data)
    } catch (error) {
      console.error("Failed to generate payment receipt PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleOpenSendEmail = () => {
    if (!validateForReceipt()) return
    if (!data.clientEmail.trim()) {
      alert("Please enter the client email")
      return
    }
    const html = buildPaymentReceiptEmailBody(data)
    setEmailPreviewHtml(html)
    setEmailForm({
      fromKey: "default",
      subject: buildReceiptHeadline(data),
      cc: "",
      bcc: "",
    })
    setEmailDialogOpen(true)
  }

  const handleSendEmail = async () => {
    if (!data.clientEmail.trim() || !emailPreviewHtml) return
    setIsSending(true)
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: data.clientEmail.trim(),
          cc: emailForm.cc.trim() || undefined,
          bcc: emailForm.bcc.trim() || undefined,
          fromKey: emailForm.fromKey,
          subject: emailForm.subject.trim() || "Your payment receipt - Jeexpert",
          body: emailPreviewHtml,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        alert(json.error || "Failed to send email")
        return
      }
      alert("Receipt email sent successfully.")
      setEmailDialogOpen(false)
      setEmailPreviewHtml(null)
    } catch (error) {
      console.error("Send receipt email failed:", error)
      alert("Failed to send email. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/generator">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Back to Generator</span>
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <img src={getPictureUrl(PICTURE_LABELS.LogoApp)} alt="Jeexpert Logo" className="h-8 w-8" />
                <div>
                  <h1 className="font-semibold text-[rgb(41,84,144)]">Payment Receipt Generator</h1>
                  <p className="text-xs text-muted-foreground">JEEXPERT ERP Light</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleOpenSendEmail}
                variant="outline"
                className="border-[rgb(41,84,144)] text-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/10"
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              <Button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="bg-[rgb(41,84,144)] hover:bg-[rgb(61,104,164)] text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Download PDF"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <Dialog open={emailDialogOpen} onOpenChange={(open) => !isSending && setEmailDialogOpen(open)}>
        <DialogContent className="max-h-[90vh] w-full max-w-3xl overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Send payment receipt by email</DialogTitle>
            <DialogDescription>
              Choose the sender address, add CC/BCC if needed, and review the preview before sending.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto flex-1 min-h-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>From address</Label>
                <Select
                  value={emailForm.fromKey}
                  onValueChange={(v) =>
                    setEmailForm((prev) => ({ ...prev, fromKey: v as "default" | "contact" | "italy" }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sender" />
                  </SelectTrigger>
                  <SelectContent>
                    {FROM_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>To</Label>
                <Input readOnly value={data.clientEmail} className="bg-muted/50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-cc">CC</Label>
              <Input
                id="email-cc"
                type="text"
                placeholder="cc@example.com (comma-separated)"
                value={emailForm.cc}
                onChange={(e) => setEmailForm((prev) => ({ ...prev, cc: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-bcc">BCC</Label>
              <Input
                id="email-bcc"
                type="text"
                placeholder="bcc@example.com (comma-separated)"
                value={emailForm.bcc}
                onChange={(e) => setEmailForm((prev) => ({ ...prev, bcc: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                placeholder="Email subject"
                value={emailForm.subject}
                onChange={(e) => setEmailForm((prev) => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="rounded-md border border-border bg-muted/30 overflow-hidden min-h-[200px] max-h-[320px] overflow-y-auto">
                {emailPreviewHtml && (
                  <iframe
                    title="Email preview"
                    srcDoc={emailPreviewHtml}
                    className="w-full min-h-[280px] border-0 bg-white"
                    sandbox="allow-same-origin"
                  />
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="shrink-0 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setEmailDialogOpen(false)} disabled={isSending}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSendEmail}
              disabled={isSending}
              className="bg-[rgb(41,84,144)] hover:bg-[rgb(61,104,164)]"
            >
              {isSending ? "Sending..." : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">Receipt Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoice-id">Reference</Label>
                <Input
                  id="invoice-id"
                  placeholder="PAY-REF-2026-001"
                  value={data.invoiceId}
                  onChange={(e) => updateData({ invoiceId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-date">Payment Date</Label>
                <Input
                  id="payment-date"
                  type="date"
                  value={data.paymentDate}
                  onChange={(e) => updateData({ paymentDate: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="payment-reason">Purpose</Label>
                <Input
                  id="payment-reason"
                  placeholder="Select or enter payment purpose"
                  value={data.paymentReason}
                  onChange={(e) => updateData({ paymentReason: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">Client Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client-name">Client Name</Label>
                <Input
                  id="client-name"
                  placeholder="Client full name"
                  value={data.clientName}
                  onChange={(e) => updateData({ clientName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-email">Client Email</Label>
                <Input
                  id="client-email"
                  type="email"
                  placeholder="client@email.com"
                  value={data.clientEmail}
                  onChange={(e) => updateData({ clientEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-phone">Client Phone</Label>
                <Input
                  id="client-phone"
                  placeholder="+39 000 000 0000"
                  value={data.clientPhone}
                  onChange={(e) => updateData({ clientPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="client-address">Client Address</Label>
                <Textarea
                  id="client-address"
                  placeholder="Street, City, Country"
                  className="min-h-[80px]"
                  value={data.clientAddress}
                  onChange={(e) => updateData({ clientAddress: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">Device and Montant</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Select
                  value={data.currency}
                  onValueChange={(value: InvoiceCurrency) => updateData({ currency: value })}
                >
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Montant</Label>
                <Input
                  id="amount"
                  type="number"
                  min={0}
                  step="0.01"
                  value={data.amount}
                  onChange={(e) => updateData({ amount: parsePositiveNumber(e.target.value) })}
                />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">Payment Method and Reference</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select
                  value={data.paymentMethod}
                  onValueChange={(value: PaymentMethod) => updateData({ paymentMethod: value })}
                >
                  <SelectTrigger id="payment-method" className="w-full">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHOD_OPTIONS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  className="min-h-[90px]"
                  placeholder="Comment for this payment"
                  value={data.comment}
                  onChange={(e) => updateData({ comment: e.target.value })}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
