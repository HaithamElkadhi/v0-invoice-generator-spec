"use client"

import { Wallet } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StudyPreferences } from "@/lib/proposal-italy-types"

interface FinancialSituationProps {
  data: StudyPreferences
  onChange: (data: StudyPreferences) => void
}

const FINANCING_PLAN_OPTIONS = [
  { value: "scholarship-only", label: "Fully dependent on scholarship" },
  { value: "scholarship-plus-personal", label: "Scholarship + personal funds" },
  { value: "personal-family-only", label: "Personal / family funds only" },
  { value: "not-sure-yet", label: "Not sure yet" },
] as const

const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const

const FINANCIAL_GUARANTOR_OPTIONS = [
  { value: "self", label: "Self" },
  { value: "parent", label: "Parent" },
  { value: "relative", label: "Relative" },
  { value: "sponsor", label: "Sponsor" },
] as const

const APPLICATION_FEES_PREFERENCE_OPTIONS = [
  { value: "separate", label: "I can pay application fees separately" },
  { value: "include-in-service", label: "Include fees in the service package" },
] as const

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{children}</Label>
}

export function FinancialSituationSection({ data, onChange }: FinancialSituationProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-emerald-600 to-teal-400" />
      <div className="flex items-center gap-4 px-8 py-6 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <Wallet className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Section 5</p>
          <h2 className="text-base font-bold text-slate-800">Financial Situation</h2>
        </div>
        <p className="hidden sm:block text-xs text-slate-400 ml-auto text-right max-w-[200px]">
          Funding strategy and visa financial readiness.
        </p>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel>How will you finance your studies?</FieldLabel>
            <Select value={data.financingPlan || ""} onValueChange={(v) => onChange({ ...data, financingPlan: v })}>
              <SelectTrigger className="h-11 border-slate-200">
                <SelectValue placeholder="Select financing plan" />
              </SelectTrigger>
              <SelectContent>
                {FINANCING_PLAN_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <FieldLabel>Who will be your financial guarantor?</FieldLabel>
            <Select value={data.financialGuarantor || ""} onValueChange={(v) => onChange({ ...data, financialGuarantor: v })}>
              <SelectTrigger className="h-11 border-slate-200">
                <SelectValue placeholder="Select guarantor" />
              </SelectTrigger>
              <SelectContent>
                {FINANCIAL_GUARANTOR_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <FieldLabel>Can you provide a blocked account?</FieldLabel>
            <Select value={data.blockedAccount || ""} onValueChange={(v) => onChange({ ...data, blockedAccount: v })}>
              <SelectTrigger className="h-11 border-slate-200">
                <SelectValue placeholder="Select answer" />
              </SelectTrigger>
              <SelectContent>
                {YES_NO_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <FieldLabel>Do you have financial support from abroad?</FieldLabel>
            <Select
              value={data.hasAbroadSupport || ""}
              onValueChange={(v) => onChange({ ...data, hasAbroadSupport: v, abroadSupportDetails: v === "yes" ? data.abroadSupportDetails : "" })}
            >
              <SelectTrigger className="h-11 border-slate-200">
                <SelectValue placeholder="Select answer" />
              </SelectTrigger>
              <SelectContent>
                {YES_NO_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {data.hasAbroadSupport === "yes" && (
          <div className="space-y-1.5">
            <FieldLabel>Specify country and relation</FieldLabel>
            <Input
              placeholder="e.g. France – uncle"
              value={data.abroadSupportDetails}
              onChange={(e) => onChange({ ...data, abroadSupportDetails: e.target.value })}
              className="h-11 border-slate-200"
            />
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel>Application fees preference</FieldLabel>
            <Select value={data.applicationFeesPreference || ""} onValueChange={(v) => onChange({ ...data, applicationFeesPreference: v })}>
              <SelectTrigger className="h-11 border-slate-200">
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>
              <SelectContent>
                {APPLICATION_FEES_PREFERENCE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <FieldLabel>Available budget (€)</FieldLabel>
            <Input
              type="number"
              placeholder="e.g. 5000"
              value={data.projectBudget}
              onChange={(e) => onChange({ ...data, projectBudget: e.target.value })}
              className="h-11 border-slate-200"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
