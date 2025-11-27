"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import type { TermsConditions } from "@/lib/proposal-italy-types"

interface TermsConditionsProps {
  data: TermsConditions
  onChange: (data: TermsConditions) => void
}

const DEFAULT_CLAUSES = {
  paymentCommitment:
    "By accepting this proposal, the student commits to paying Jeexpert admission fees (the upfront non-refundable fee and the additional fee upon acceptance) as well as any university application or administrative fees required to complete the application process.",
  nonRefundableFees:
    "The initial Jeexpert admission fee is non-refundable, as it covers consulting, document preparation, and application submission. University application fees and any third-party fees are also non-refundable under any circumstances.",
  personalDataDelegation:
    "The student authorizes Jeexpert to use their personal data solely for academic application purposes and allows Jeexpert to submit applications on their behalf to universities and institutions. The student understands that Jeexpert does not influence university admission decisions.",
  additionalTerms: "",
}

export function TermsConditionsSection({ data, onChange }: TermsConditionsProps) {
  const updateField = (field: keyof TermsConditions, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const loadDefaults = () => {
    onChange(DEFAULT_CLAUSES)
  }

  const isDefaultsLoaded =
    data.paymentCommitment || data.nonRefundableFees || data.personalDataDelegation || data.additionalTerms

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[rgb(41,84,144)]">6. Terms & Conditions</h2>
        <Button variant="outline" size="sm" onClick={loadDefaults}>
          <RotateCcw className="mr-2 h-4 w-4" />
          {isDefaultsLoaded ? "Reset to Defaults" : "Load Defaults"}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="paymentCommitment">Payment Commitment</Label>
          <Textarea
            id="paymentCommitment"
            value={data.paymentCommitment}
            onChange={(e) => updateField("paymentCommitment", e.target.value)}
            rows={4}
            placeholder="Enter payment commitment clause..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nonRefundableFees">Non-Refundable Fees</Label>
          <Textarea
            id="nonRefundableFees"
            value={data.nonRefundableFees}
            onChange={(e) => updateField("nonRefundableFees", e.target.value)}
            rows={4}
            placeholder="Enter non-refundable fees clause..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="personalDataDelegation">Personal Data & Delegation</Label>
          <Textarea
            id="personalDataDelegation"
            value={data.personalDataDelegation}
            onChange={(e) => updateField("personalDataDelegation", e.target.value)}
            rows={4}
            placeholder="Enter personal data & delegation clause..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalTerms">Additional Terms (Optional)</Label>
          <Textarea
            id="additionalTerms"
            value={data.additionalTerms}
            onChange={(e) => updateField("additionalTerms", e.target.value)}
            rows={3}
            placeholder="Enter any additional custom terms, deadlines, disclaimers..."
          />
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Empty clauses will not appear in the PDF. Modify or translate clauses as needed.
      </p>
    </div>
  )
}
