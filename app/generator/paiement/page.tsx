"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getPictureUrl, PICTURE_LABELS } from "@/lib/pictures"
import type { InvoiceCurrency, PaymentMethodsSelection } from "@/lib/invoice-types"
import type { PaymentMethod, PaymentReceiptData } from "@/lib/payment-receipt-types"

type PaiementItem = {
  id: string
  reference: string
  fullName: string[]
  email: string[]
  amount: string
  currency: string
  purpose: string[]
  status: string
  dueDate: string
  paymentDate: string
  paymentMethod: string
  billingAddress: string
  comment: string
  invoice: Array<{ id?: string; url?: string; filename?: string }>
  proofOfPayment: Array<{ id?: string; url?: string; filename?: string }>
  lastModified: string
}

const RECEIPT_PREFILL_STORAGE_KEY = "payment-receipt-prefill-v1"
const INVOICE_PREFILL_STORAGE_KEY = "invoice-prefill-v1"
const PAIEMENTS_CACHE_KEY = "paiements-cache-v1"

function normalizeCurrency(value: string): InvoiceCurrency {
  const upper = value.trim().toUpperCase()
  if (upper === "EUR" || upper === "USD" || upper === "TND") return upper
  return "EUR"
}

function normalizePaymentMethod(value: string): PaymentMethod {
  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_")
  if (normalized.includes("bank") || normalized.includes("transfer")) return "bank_transfer"
  if (normalized.includes("card")) return "credit_card"
  if (normalized.includes("mobile")) return "mobile_money"
  if (normalized.includes("paypal")) return "paypal"
  if (normalized.includes("cash") || normalized.includes("espece") || normalized.includes("espèce")) return "cash"
  return "other"
}

function parseAmount(value: string): number {
  if (!value.trim()) return 0
  const normalized = value.replace(",", ".").replace(/[^\d.-]/g, "")
  const parsed = Number(normalized)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

function normalizeInvoicePaymentMethods(value: string): PaymentMethodsSelection {
  const normalized = value.trim().toLowerCase()
  if (normalized.includes("paypal")) {
    return { paypal: true, bankTransfer: false, other: false }
  }
  if (normalized.includes("bank") || normalized.includes("transfer")) {
    return { paypal: false, bankTransfer: true, other: false }
  }
  return { paypal: false, bankTransfer: false, other: true }
}

function formatDate(value: string): string {
  if (!value) return "-"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString("fr-FR")
}

function displayList(values: string[]): string {
  return values.filter(Boolean).join(", ") || "-"
}

export default function PaiementPage() {
  const router = useRouter()
  const [items, setItems] = useState<PaiementItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null)

  const fetchPaiements = async (forceRefresh = false) => {
    setLoading(true)
    setError(null)

    if (!forceRefresh) {
      try {
        const raw = window.localStorage.getItem(PAIEMENTS_CACHE_KEY)
        if (raw) {
          const cache = JSON.parse(raw) as { items?: PaiementItem[]; lastUpdatedAt?: string }
          if (Array.isArray(cache.items) && cache.items.length >= 0) {
            setItems(cache.items)
            setLastUpdatedAt(typeof cache.lastUpdatedAt === "string" ? cache.lastUpdatedAt : null)
            setLoading(false)
            return
          }
        }
      } catch (cacheError) {
        console.error("Failed to read paiements cache:", cacheError)
      }
    }

    try {
      const response = await fetch("/api/paiements/fetch")
      const json = await response.json()
      if (!response.ok) {
        setError(json.error || "Failed to fetch paiements")
        return
      }
      const fetchedItems = Array.isArray(json.paiements) ? (json.paiements as PaiementItem[]) : []
      const nowIso = new Date().toISOString()
      setItems(fetchedItems)
      setLastUpdatedAt(nowIso)
      try {
        window.localStorage.setItem(
          PAIEMENTS_CACHE_KEY,
          JSON.stringify({
            items: fetchedItems,
            lastUpdatedAt: nowIso,
          })
        )
      } catch (cacheError) {
        console.error("Failed to save paiements cache:", cacheError)
      }
    } catch (err) {
      console.error("Fetch paiements failed:", err)
      setError("Failed to fetch paiements")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchPaiements()
  }, [])

  const filteredItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) => {
      const haystack = [
        item.reference,
        item.amount,
        item.currency,
        item.status,
        item.paymentMethod,
        item.comment,
        item.fullName.join(" "),
        item.email.join(" "),
        item.purpose.join(" "),
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [items, searchTerm])

  const total = useMemo(() => filteredItems.length, [filteredItems])

  const handleOpenReceipt = (item: PaiementItem) => {
    const payload: PaymentReceiptData = {
      invoiceId: item.reference || "",
      paymentDate: item.paymentDate || new Date().toISOString().split("T")[0],
      paymentReason: item.purpose.join(", "),
      clientName: item.fullName[0] || "",
      clientEmail: item.email[0] || "",
      clientPhone: "",
      clientAddress: item.billingAddress || "",
      paymentMethod: normalizePaymentMethod(item.paymentMethod),
      currency: normalizeCurrency(item.currency),
      amount: parseAmount(item.amount),
      comment: item.comment || "",
    }

    window.localStorage.setItem(RECEIPT_PREFILL_STORAGE_KEY, JSON.stringify(payload))
    router.push("/generator/payment-receipt?prefill=1")
  }

  const handleOpenInvoice = (item: PaiementItem) => {
    const payload = {
      invoiceNumber: item.reference || "",
      date: item.paymentDate || new Date().toISOString().split("T")[0],
      dueDate: item.dueDate || "",
      currency: normalizeCurrency(item.currency),
      clientName: item.fullName[0] || "",
      clientEmail: item.email[0] || "",
      clientAddress: item.billingAddress || "",
      itemDescription: item.purpose.join(", ") || "Payment",
      itemAmount: parseAmount(item.amount),
      paymentMethods: normalizeInvoicePaymentMethods(item.paymentMethod),
    }

    window.localStorage.setItem(INVOICE_PREFILL_STORAGE_KEY, JSON.stringify(payload))
    router.push("/generator/invoice?prefill=1")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={getPictureUrl(PICTURE_LABELS.LogoApp)} alt="Jeexpert Logo" className="h-8 w-8" />
              <div>
                <h1 className="font-semibold text-[rgb(41,84,144)]">Paiement</h1>
                <p className="text-xs text-muted-foreground">Live records from Airtable table Paiements</p>
              </div>
            </div>
            <Button
              onClick={() => void fetchPaiements(true)}
              variant="outline"
              className="border-[rgb(41,84,144)] text-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/10"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/generator"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[rgb(41,84,144)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Generator
        </Link>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Paiements</h2>
          <p className="text-sm text-muted-foreground">{total} records</p>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <Input
            placeholder="Search by reference, name, email, purpose, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center justify-start sm:justify-end">
            <p className="text-xs text-muted-foreground">
              Last update: {lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleString("fr-FR") : "-"}
            </p>
          </div>
        </div>

        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          {loading && <p className="text-sm text-muted-foreground">Loading paiements...</p>}
          {!loading && error && <p className="text-sm text-destructive">{error}</p>}

          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Invoice Files</TableHead>
                  <TableHead>Proof</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={15} className="text-center text-muted-foreground">
                      No paiement records found.
                    </TableCell>
                  </TableRow>
                )}
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.reference || "-"}</TableCell>
                    <TableCell>{displayList(item.fullName)}</TableCell>
                    <TableCell>{displayList(item.email)}</TableCell>
                    <TableCell>{item.amount || "-"}</TableCell>
                    <TableCell>{item.currency || "-"}</TableCell>
                    <TableCell>{displayList(item.purpose)}</TableCell>
                    <TableCell>{item.status || "-"}</TableCell>
                    <TableCell>{formatDate(item.dueDate)}</TableCell>
                    <TableCell>{formatDate(item.paymentDate)}</TableCell>
                    <TableCell>{item.paymentMethod || "-"}</TableCell>
                    <TableCell>{item.invoice.length}</TableCell>
                    <TableCell>{item.proofOfPayment.length}</TableCell>
                    <TableCell className="max-w-[320px] truncate" title={item.comment || "-"}>
                      {item.comment || "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-[rgb(41,84,144)] text-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/10"
                        onClick={() => handleOpenReceipt(item)}
                      >
                        Receipt
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-[rgb(41,84,144)] text-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/10"
                        onClick={() => handleOpenInvoice(item)}
                      >
                        Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>
      </main>
    </div>
  )
}
