"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { InvoiceData } from "@/lib/invoice-types"

interface InvoiceHeaderProps {
  data: InvoiceData
  onChange: (updates: Partial<InvoiceData>) => void
}

export function InvoiceHeader({ data, onChange }: InvoiceHeaderProps) {
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ""
    return dateString
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="invoiceNumber">Invoice Number</Label>
        <Input
          id="invoiceNumber"
          placeholder="e.g., INV-001"
          value={data.invoiceNumber}
          onChange={(e) => onChange({ invoiceNumber: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">Optional - defaults to "draft" if empty</p>
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
    </div>
  )
}
