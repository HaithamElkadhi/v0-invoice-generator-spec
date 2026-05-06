"use client"

import { Layers, Star, Award, BookOpen, FileCheck, Globe, Package, Sparkles } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Services } from "@/lib/proposal-italy-types"

interface ServicesSectionProps {
  data: Services
  onChange: (data: Services) => void
}

const SERVICE_OPTIONS = [
  { name: "Admission Standard", icon: FileCheck, color: "blue", desc: "University application support" },
  { name: "Admission Premium", icon: Award, color: "violet", desc: "Priority & dedicated advisor" },
  { name: "Scholarship", icon: Star, color: "amber", desc: "Scholarship search & application" },
  { name: "Visa Support", icon: Globe, color: "emerald", desc: "Visa documentation & prep" },
  { name: "Integration", icon: BookOpen, color: "sky", desc: "Settling in Italy" },
  { name: "Standard Pack", icon: Package, color: "slate", desc: "Core services bundle" },
  { name: "Elite Pack", icon: Sparkles, color: "rose", desc: "All-inclusive premium bundle" },
] as const

const colorMap: Record<string, { border: string; bg: string; text: string; iconBg: string }> = {
  blue:   { border: "border-blue-400",   bg: "bg-blue-50",   text: "text-blue-700",   iconBg: "bg-blue-100" },
  violet: { border: "border-violet-400", bg: "bg-violet-50", text: "text-violet-700", iconBg: "bg-violet-100" },
  amber:  { border: "border-amber-400",  bg: "bg-amber-50",  text: "text-amber-700",  iconBg: "bg-amber-100" },
  emerald:{ border: "border-emerald-400",bg: "bg-emerald-50",text: "text-emerald-700",iconBg: "bg-emerald-100" },
  sky:    { border: "border-sky-400",    bg: "bg-sky-50",    text: "text-sky-700",    iconBg: "bg-sky-100" },
  slate:  { border: "border-slate-400",  bg: "bg-slate-100", text: "text-slate-700",  iconBg: "bg-slate-200" },
  rose:   { border: "border-rose-400",   bg: "bg-rose-50",   text: "text-rose-700",   iconBg: "bg-rose-100" },
}

export function ServicesSection({ data, onChange }: ServicesSectionProps) {
  const toggleService = (service: string) => {
    const current = data.selected || []
    const updated = current.includes(service) ? current.filter((s) => s !== service) : [...current, service]
    onChange({ ...data, selected: updated })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-amber-500 to-rose-400" />
      <div className="flex items-center gap-4 px-8 py-6 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
          <Layers className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Section 6</p>
          <h2 className="text-base font-bold text-slate-800">Services</h2>
        </div>
        {data.selected.length > 0 && (
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
            {data.selected.length}
          </span>
        )}
      </div>

      <div className="p-8 space-y-6">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Select Services</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SERVICE_OPTIONS.map(({ name, icon: Icon, color, desc }) => {
              const selected = (data.selected || []).includes(name)
              const c = colorMap[color]
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleService(name)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all",
                    selected ? `${c.border} ${c.bg}` : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                    selected ? c.iconBg : "bg-slate-100"
                  )}>
                    <Icon className={cn("w-5 h-5", selected ? c.text : "text-slate-400")} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm font-semibold", selected ? c.text : "text-slate-700")}>{name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all",
                    selected ? `${c.border} ${c.iconBg}` : "border-slate-200"
                  )}>
                    {selected && (
                      <svg className={cn("w-3 h-3", c.text)} viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Note</Label>
          <Input
            placeholder="Any additional notes about services…"
            value={data.note}
            onChange={(e) => onChange({ ...data, note: e.target.value })}
            className="h-11 border-slate-200"
          />
        </div>
      </div>
    </div>
  )
}
