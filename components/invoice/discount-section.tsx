"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { InvoiceData } from "@/lib/invoice-types"

interface DiscountSectionProps {
  data: InvoiceData
  onChange: (updates: Partial<InvoiceData>) => void
}

export function DiscountSection({ data, onChange }: DiscountSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="discountEnabled"
          checked={data.discountEnabled}
          onCheckedChange={(checked) =>
            onChange({
              discountEnabled: checked === true,
              discountPercentage: checked ? data.discountPercentage : 0,
            })
          }
        />
        <Label htmlFor="discountEnabled" className="cursor-pointer">
          Enable discount
        </Label>
      </div>

      {data.discountEnabled && (
        <div className="grid gap-4 sm:grid-cols-2 pl-6 border-l-2 border-[rgb(41,84,144)]/20">
          <div className="space-y-2">
            <Label htmlFor="discountPercentage">Discount Percentage (%)</Label>
            <Input
              id="discountPercentage"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={data.discountPercentage}
              onChange={(e) =>
                onChange({
                  discountPercentage: Math.min(100, Math.max(0, Number.parseFloat(e.target.value) || 0)),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountReason">Discount Reason (optional)</Label>
            <Input
              id="discountReason"
              placeholder="e.g., Early payment"
              value={data.discountReason}
              onChange={(e) => onChange({ discountReason: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  )
}
