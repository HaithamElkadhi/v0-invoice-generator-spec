"use client"

import { CalendarDays } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { ProposalItalyData } from "@/lib/proposal-italy-types"

interface ProposalHeaderProps {
  data: ProposalItalyData
  onChange: (data: Partial<ProposalItalyData>) => void
}

export function ProposalHeader({ data, onChange }: ProposalHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-[rgb(41,84,144)] to-blue-400" />
      <div className="flex items-center gap-4 px-8 py-6 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-[rgb(41,84,144)]/10 flex items-center justify-center flex-shrink-0">
          <CalendarDays className="w-5 h-5 text-[rgb(41,84,144)]" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-[rgb(41,84,144)] uppercase tracking-widest">Section 1</p>
          <h2 className="text-base font-bold text-slate-800">Proposal Information</h2>
        </div>
        <p className="hidden sm:block text-xs text-slate-400 ml-auto text-right max-w-[180px]">
          Set the date and validity window.
        </p>
      </div>
      <div className="p-8 grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="proposalDate" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Proposal Date
          </Label>
          <Input
            id="proposalDate"
            type="date"
            value={data.proposalDate}
            onChange={(e) => onChange({ proposalDate: e.target.value })}
            className="h-12 border-slate-200 text-base focus:border-[rgb(41,84,144)] focus:ring-[rgb(41,84,144)]/20"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="validUntil" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Valid Until <span className="text-slate-400 font-normal normal-case tracking-normal">(optional)</span>
          </Label>
          <Input
            id="validUntil"
            type="date"
            value={data.validUntil}
            onChange={(e) => onChange({ validUntil: e.target.value })}
            className="h-12 border-slate-200 text-base focus:border-[rgb(41,84,144)] focus:ring-[rgb(41,84,144)]/20"
          />
        </div>
      </div>
    </div>
  )
}
