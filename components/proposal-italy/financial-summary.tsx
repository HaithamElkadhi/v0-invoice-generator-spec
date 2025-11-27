"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { FinancialSummaryData } from "@/lib/proposal-italy-types"

interface FinancialSummaryProps {
  data: FinancialSummaryData
  onChange: (data: FinancialSummaryData) => void
}

export function FinancialSummary({ data, onChange }: FinancialSummaryProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">5. Financial Summary</h2>

      <div className="space-y-4">
        {/* Estimated University/Application Fees - Text Input */}
        <div className="space-y-2">
          <Label htmlFor="estimatedUniversityFees">Estimated University/Application Fees (€)</Label>
          <Input
            id="estimatedUniversityFees"
            value={data.estimatedUniversityFees}
            onChange={(e) => onChange({ ...data, estimatedUniversityFees: e.target.value })}
            placeholder="e.g., 50 € per application, 156 €, Varies by university"
          />
          <p className="text-xs text-muted-foreground">
            Free text - allows numeric values or notes like "Depends on university"
          </p>
        </div>

        {/* Jeexpert Fees - Two columns */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="jeexpertUpfrontFee">Jeexpert Upfront Admission Fee (€)</Label>
            <Input
              id="jeexpertUpfrontFee"
              type="number"
              value={data.jeexpertUpfrontFee || ""}
              onChange={(e) => onChange({ ...data, jeexpertUpfrontFee: Number.parseFloat(e.target.value) || 0 })}
              placeholder="100"
            />
            <p className="text-xs text-muted-foreground">Non-refundable fee paid before application starts</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="jeexpertAdditionalFee">Jeexpert Additional Fee Upon Acceptance (€)</Label>
            <Input
              id="jeexpertAdditionalFee"
              type="number"
              value={data.jeexpertAdditionalFee || ""}
              onChange={(e) => onChange({ ...data, jeexpertAdditionalFee: Number.parseFloat(e.target.value) || 0 })}
              placeholder="200"
            />
            <p className="text-xs text-muted-foreground">Additional fee paid only if accepted by university</p>
          </div>
        </div>

        {/* Additional Notes - Optional */}
        <div className="space-y-2">
          <Label htmlFor="additionalFinancialNotes">Additional Notes (Optional)</Label>
          <Textarea
            id="additionalFinancialNotes"
            value={data.additionalFinancialNotes}
            onChange={(e) => onChange({ ...data, additionalFinancialNotes: e.target.value })}
            placeholder="e.g., Scholarship may reduce final cost, Living expenses not included..."
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}
