"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { ProposalItalyData } from "@/lib/proposal-italy-types"

interface ProposalHeaderProps {
  data: ProposalItalyData
  onChange: (data: Partial<ProposalItalyData>) => void
}

export function ProposalHeader({ data, onChange }: ProposalHeaderProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">1. Proposal Information</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="proposalNumber">Proposal Number</Label>
          <Input
            id="proposalNumber"
            placeholder="PROP-2024-001"
            value={data.proposalNumber}
            onChange={(e) => onChange({ proposalNumber: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="studentId">Student ID</Label>
          <Input
            id="studentId"
            placeholder="STU-2024-001"
            value={data.studentId}
            onChange={(e) => onChange({ studentId: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="proposalDate">Proposal Date</Label>
          <Input
            id="proposalDate"
            type="date"
            value={data.proposalDate}
            onChange={(e) => onChange({ proposalDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="validUntil">Valid Until</Label>
          <Input
            id="validUntil"
            type="date"
            value={data.validUntil}
            onChange={(e) => onChange({ validUntil: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
