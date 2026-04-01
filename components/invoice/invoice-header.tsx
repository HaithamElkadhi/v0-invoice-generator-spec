"use client"

import { useState, useRef, useEffect } from "react"
import { RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CURRENCY_OPTIONS, type InvoiceData } from "@/lib/invoice-types"

interface InvoiceHeaderProps {
  data: InvoiceData
  onChange: (updates: Partial<InvoiceData>) => void
}

export function InvoiceHeader({ data, onChange }: InvoiceHeaderProps) {
  const [invoiceNumbers, setInvoiceNumbers] = useState<string[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [showList, setShowList] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleFetch = async () => {
    setIsFetching(true)
    setShowList(false)
    try {
      const res = await fetch("/api/invoice/fetch")
      const json = await res.json()
      if (res.ok && Array.isArray(json.invoiceNumbers) && json.invoiceNumbers.length > 0) {
        setInvoiceNumbers(json.invoiceNumbers)
        setShowList(true)
      } else {
        setInvoiceNumbers([])
      }
    } catch {
      setInvoiceNumbers([])
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowList(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ""
    return dateString
  }

  return (
    <div className="grid gap-4 sm:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="invoiceNumber">Invoice Number</Label>
        <div ref={wrapperRef} className="relative max-w-[280px]">
          <Input
            id="invoiceNumber"
            placeholder="e.g., INV-001"
            value={data.invoiceNumber}
            onChange={(e) => onChange({ invoiceNumber: e.target.value })}
            className="pr-10"
          />
          <button
            type="button"
            onClick={handleFetch}
            disabled={isFetching}
            title="Fetch from Airtable"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50",
              isFetching && "animate-spin"
            )}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          {showList && invoiceNumbers.length > 0 && (
            <ul
              className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-auto rounded-md border bg-popover py-1 shadow-md"
              role="listbox"
            >
              {invoiceNumbers.map((num) => (
                <li key={num}>
                  <button
                    type="button"
                    role="option"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      onChange({ invoiceNumber: num })
                      setShowList(false)
                    }}
                  >
                    {num}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Optional - defaults to "draft" if empty. Click the ↻ icon to fetch from Airtable</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formatDateForDisplay(data.date)}
          onChange={(e) => onChange({ date: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={formatDateForDisplay(data.dueDate)}
          onChange={(e) => onChange({ dueDate: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">Optional but recommended</p>
      </div>

      <div className="space-y-2">
        <Label>Currency</Label>
        <Select
          value={data.currency}
          onValueChange={(value) => onChange({ currency: value as InvoiceData["currency"] })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
