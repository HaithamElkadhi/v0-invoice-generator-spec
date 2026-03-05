"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { InvoiceData } from "@/lib/invoice-types"

interface ClientInfoProps {
  data: InvoiceData
  onChange: (updates: Partial<InvoiceData>) => void
}

export function ClientInfo({ data, onChange }: ClientInfoProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="clientName">
          Client Name <span className="text-[rgb(220,53,69)]">*</span>
        </Label>
        <Input
          id="clientName"
          placeholder="Enter client name"
          value={data.clientName}
          onChange={(e) => onChange({ clientName: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientEmail">
          Client Email <span className="text-[rgb(220,53,69)]">*</span>
        </Label>
        <Input
          id="clientEmail"
          type="email"
          placeholder="student@example.com"
          value={data.clientEmail}
          onChange={(e) => onChange({ clientEmail: e.target.value })}
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="clientAddress">Client Address</Label>
        <Textarea
          id="clientAddress"
          placeholder="Enter client address (multiple lines supported)"
          value={data.clientAddress}
          onChange={(e) => onChange({ clientAddress: e.target.value })}
          rows={3}
          className="resize-none"
        />
      </div>
    </div>
  )
}
