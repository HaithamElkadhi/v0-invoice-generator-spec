"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Mail, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { InvoiceHeader } from "@/components/invoice/invoice-header"
import { ClientInfo } from "@/components/invoice/client-info"
import { ItemsTable } from "@/components/invoice/items-table"
import { DiscountSection } from "@/components/invoice/discount-section"
import { PaymentMethods } from "@/components/invoice/payment-methods"
import { TotalsSummary } from "@/components/invoice/totals-summary"
import { generateInvoicePDF } from "@/lib/pdf-generator"
import { buildInvoiceEmailBody } from "@/lib/invoice-email-body"
import type { InvoiceData, InvoiceItem } from "@/lib/invoice-types"
import { getPictureUrl, PICTURE_LABELS } from "@/lib/pictures"

const FROM_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "contact", label: "Contact" },
  { value: "italy", label: "Italy" },
] as const

const initialItem: InvoiceItem = {
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  unitPrice: 0,
}

export default function InvoicePage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    currency: "EUR",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    items: [initialItem],
    discountEnabled: false,
    discountPercentage: 0,
    discountReason: "",
    paymentMethods: {
      paypal: false,
      bankTransfer: false,
      other: false,
    },
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [emailPreviewHtml, setEmailPreviewHtml] = useState<string | null>(null)
  const [emailForm, setEmailForm] = useState({
    fromKey: "default" as "default" | "contact" | "italy",
    subject: "",
    cc: "",
    bcc: "",
  })

  const updateInvoiceData = useCallback((updates: Partial<InvoiceData>) => {
    setInvoiceData((prev) => ({ ...prev, ...updates }))
  }, [])

  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  const discountAmount = invoiceData.discountEnabled ? subtotal * (invoiceData.discountPercentage / 100) : 0

  const finalTotal = subtotal - discountAmount

  const handleGeneratePDF = async () => {
    if (!invoiceData.clientName.trim()) {
      alert("Please enter a client name")
      return
    }

    if (invoiceData.items.every((item) => !item.description.trim())) {
      alert("Please add at least one item with a description")
      return
    }

    if (!Object.values(invoiceData.paymentMethods).some(Boolean)) {
      alert("Please select at least one payment method")
      return
    }

    setIsGenerating(true)
    try {
      await generateInvoicePDF({
        ...invoiceData,
        subtotal,
        discountAmount,
        finalTotal,
      })
    } catch (error) {
      console.error("PDF generation failed:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveToAirtable = async () => {
    if (!invoiceData.clientName.trim()) {
      alert("Please enter a client name")
      return
    }

    if (!Object.values(invoiceData.paymentMethods).some(Boolean)) {
      alert("Please select at least one payment method")
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch("/api/invoice/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: invoiceData.date,
          dueDate: invoiceData.dueDate,
          clientName: invoiceData.clientName,
          clientAddress: invoiceData.clientAddress,
          finalTotal,
          paymentMethods: invoiceData.paymentMethods,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to save")
        return
      }

      alert("Invoice saved to Airtable successfully!")
    } catch (error) {
      console.error("Save to Airtable failed:", error)
      alert(error instanceof Error ? error.message : "Failed to save. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleOpenSendEmail = () => {
    if (!invoiceData.clientName?.trim()) {
      alert("Please enter a client name")
      return
    }
    if (!invoiceData.clientEmail?.trim()) {
      alert("Please enter the student's email address")
      return
    }
    if (invoiceData.items.every((item) => !item.description.trim())) {
      alert("Please add at least one item with a description")
      return
    }
    if (!Object.values(invoiceData.paymentMethods).some(Boolean)) {
      alert("Please select at least one payment method")
      return
    }
    const htmlBody = buildInvoiceEmailBody({
      ...invoiceData,
      subtotal,
      discountAmount,
      finalTotal,
    })
    setEmailPreviewHtml(htmlBody)
    setEmailForm((prev) => ({
      ...prev,
      fromKey: "default",
      subject: invoiceData.invoiceNumber
        ? `Your Invoice ${invoiceData.invoiceNumber} – Jeexpert`
        : "Your Invoice – Jeexpert",
      cc: "",
      bcc: "",
    }))
    setEmailDialogOpen(true)
  }

  const handleSendEmail = async () => {
    if (!emailPreviewHtml || !invoiceData.clientEmail?.trim()) return
    setIsSending(true)
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: invoiceData.clientEmail.trim(),
          cc: emailForm.cc.trim() || undefined,
          bcc: emailForm.bcc.trim() || undefined,
          fromKey: emailForm.fromKey,
          subject: emailForm.subject.trim() || "Your Invoice – Jeexpert",
          body: emailPreviewHtml,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        alert(json.error || "Failed to send email")
        return
      }
      alert("Email sent successfully to the student.")
      setEmailDialogOpen(false)
      setEmailPreviewHtml(null)
    } catch (err) {
      console.error("Send email error:", err)
      alert("Failed to send email. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Back to Generator</span>
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <img src={getPictureUrl(PICTURE_LABELS.LogoApp)} alt="Jeexpert Logo" className="h-8 w-8" />
                <div>
                  <h1 className="font-semibold text-[rgb(41,84,144)]">Invoice Generator</h1>
                  <p className="text-xs text-muted-foreground">JEEXPERT ERP Light</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSaveToAirtable}
                disabled={isSaving}
                variant="outline"
                className="border-[rgb(41,84,144)] text-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/10"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
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

      {/* Send Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={(open) => !isSending && setEmailDialogOpen(open)}>
        <DialogContent className="max-h-[90vh] w-full max-w-3xl overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Send invoice by email</DialogTitle>
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
                <Input
                  readOnly
                  value={invoiceData.clientEmail}
                  className="bg-muted/50"
                />
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setEmailDialogOpen(false)}
              disabled={isSending}
            >
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

      {/* Main Form */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Invoice Header Section */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">Invoice Details</h2>
            <InvoiceHeader data={invoiceData} onChange={updateInvoiceData} />
          </section>

          {/* Client Information */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">Client Information</h2>
            <ClientInfo data={invoiceData} onChange={updateInvoiceData} />
          </section>

          {/* Invoice Items */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">Invoice Items</h2>
            <ItemsTable data={invoiceData} onChange={updateInvoiceData} />
          </section>

          {/* Discount Section */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">Discount</h2>
            <DiscountSection data={invoiceData} onChange={updateInvoiceData} />
          </section>

          {/* Payment Methods */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">Payment Methods</h2>
            <PaymentMethods data={invoiceData} onChange={updateInvoiceData} />
          </section>

          {/* Totals Summary */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <TotalsSummary
              subtotal={subtotal}
              discountEnabled={invoiceData.discountEnabled}
              discountPercentage={invoiceData.discountPercentage}
              discountAmount={discountAmount}
              finalTotal={finalTotal}
              currency={invoiceData.currency}
            />
          </section>
        </div>
      </main>
    </div>
  )
}
