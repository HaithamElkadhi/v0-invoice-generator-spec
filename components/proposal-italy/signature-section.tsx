"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface SignatureSectionProps {
  consultantName: string
  onChange: (name: string) => void
}

export function SignatureSection({ consultantName, onChange }: SignatureSectionProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">8. Consultant & Signature</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="consultantName">Consultant Name</Label>
            <Input
              id="consultantName"
              value={consultantName}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter consultant name"
            />
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Consultant Signature:</p>
            <div className="mt-2 h-16 rounded border-2 border-dashed border-border" />
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">Student Acknowledgment</p>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Student Signature:</p>
            <div className="mt-2 h-16 rounded border-2 border-dashed border-border" />
            <p className="mt-2 text-xs text-muted-foreground">Date: _________________</p>
          </div>
        </div>
      </div>
    </div>
  )
}
