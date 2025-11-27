"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { ProposalItalyData } from "@/lib/proposal-italy-types"

interface StudentInfoProps {
  data: ProposalItalyData
  onChange: (data: Partial<ProposalItalyData>) => void
}

export function StudentInfo({ data, onChange }: StudentInfoProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">2. Student Information</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="studentName">Full Name *</Label>
          <Input
            id="studentName"
            placeholder="Student full name"
            value={data.studentName}
            onChange={(e) => onChange({ studentName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="student@email.com"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+216 XX XXX XXX"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            placeholder="e.g., Tunisian"
            value={data.nationality}
            onChange={(e) => onChange({ nationality: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
