"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InvoiceHeader } from "@/components/invoice/invoice-header"
import { ClientInfo } from "@/components/invoice/client-info"
import { ItemsTable } from "@/components/invoice/items-table"
import { DiscountSection } from "@/components/invoice/discount-section"
import { PaymentMethods } from "@/components/invoice/payment-methods"
import { TotalsSummary } from "@/components/invoice/totals-summary"
import { generateInvoicePDF } from "@/lib/pdf-generator"
import type { InvoiceData, InvoiceItem } from "@/lib/invoice-types"

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
    clientName: "",
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
                <img src="/images/jeexpert-20logo-20inversed.png" alt="Jeexpert Logo" className="h-8 w-8" />
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
            />
          </section>
        </div>
      </main>
    </div>
  )
}
