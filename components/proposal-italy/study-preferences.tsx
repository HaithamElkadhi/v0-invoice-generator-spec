"use client"

import { BookOpen } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { StudyPreferences } from "@/lib/proposal-italy-types"

interface StudyPreferencesProps {
  data: StudyPreferences
  onChange: (data: StudyPreferences) => void
}

const DEGREE_LEVELS_ITALY = [
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
  { value: "researcher", label: "Searcher" },
  { value: "phd", label: "PHD" },
  { value: "formation-prof", label: "Formation Prof" },
] as const

const INTAKES = [
  { value: "2026/2027", label: "2026/2027" },
  { value: "2027/2028", label: "2027/2028" },
  { value: "Flexible", label: "Flexible" },
] as const

const PROGRAM_LANGUAGE_OPTIONS = ["EN", "IT"] as const

const CITY_PREFERENCE_OPTIONS = [
  { value: "large_international", label: "Large international city", desc: "Milan, Rome, Turin" },
  { value: "student_city", label: "Student city", desc: "Bologna, Padua, Pisa" },
  { value: "affordable_south", label: "Affordable southern region", desc: "Naples, Palermo, Bari" },
  { value: "no_preference", label: "No preference", desc: "Best admission chance" },
] as const

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{children}</p>
}

export function StudyPreferencesSection({ data, onChange }: StudyPreferencesProps) {
  const toggleProgramLanguage = (option: string) => {
    const current = data.programLanguages || []
    const updated = current.includes(option) ? current.filter((s) => s !== option) : [...current, option]
    onChange({ ...data, programLanguages: updated })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-400" />
      <div className="flex items-center gap-4 px-8 py-6 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Section 4</p>
          <h2 className="text-base font-bold text-slate-800">Study Preferences</h2>
        </div>
        <p className="hidden sm:block text-xs text-slate-400 ml-auto text-right max-w-[200px]">
          Target degree, intake, and destination preferences.
        </p>
      </div>

      <div className="p-8 space-y-10">
        {/* Target & intake */}
        <div>
          <SectionTitle>Target Program</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Degree Level</Label>
              <Select value={data.targetDegreeLevel || ""} onValueChange={(v) => onChange({ ...data, targetDegreeLevel: v })}>
                <SelectTrigger className="h-11 border-slate-200">
                  <SelectValue placeholder="Select degree" />
                </SelectTrigger>
                <SelectContent>
                  {DEGREE_LEVELS_ITALY.map((d) => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Intended Intake</Label>
              <Select value={data.intendedIntake || ""} onValueChange={(v) => onChange({ ...data, intendedIntake: v })}>
                <SelectTrigger className="h-11 border-slate-200">
                  <SelectValue placeholder="Select intake" />
                </SelectTrigger>
                <SelectContent>
                  {INTAKES.map((i) => (
                    <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Field of study */}
        <div>
          <SectionTitle>Field of Study</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Primary Field</Label>
              <Input
                placeholder="e.g. Engineering, Economics, Medicine"
                value={data.fieldOfStudyPrimary}
                onChange={(e) => onChange({ ...data, fieldOfStudyPrimary: e.target.value })}
                className="h-11 border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Alternative Field <span className="text-slate-400 font-normal normal-case tracking-normal">(optional)</span>
              </Label>
              <Input
                placeholder="e.g. Data Science, International Relations"
                value={data.alternativeField}
                onChange={(e) => onChange({ ...data, alternativeField: e.target.value })}
                className="h-11 border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Teaching language */}
        <div>
          <SectionTitle>Preferred Teaching Language</SectionTitle>
          <div className="flex gap-3">
            {PROGRAM_LANGUAGE_OPTIONS.map((option) => {
              const selected = (data.programLanguages || []).includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleProgramLanguage(option)}
                  className={cn(
                    "flex items-center justify-center w-20 h-12 rounded-xl border-2 font-bold text-lg transition-all",
                    selected
                      ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                      : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </div>

        {/* City preference */}
        <div>
          <SectionTitle>Preferred City Type</SectionTitle>
          <div className="grid gap-2 sm:grid-cols-2">
            {CITY_PREFERENCE_OPTIONS.map((opt) => {
              const selected = data.cityPreferenceType === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ ...data, cityPreferenceType: opt.value })}
                  className={cn(
                    "text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-all",
                    selected
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center",
                    selected ? "border-blue-500 bg-blue-500" : "border-slate-300"
                  )}>
                    {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className={cn("text-sm font-semibold", selected ? "text-blue-700" : "text-slate-700")}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Preferred city / university */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Preferred City / University</Label>
          <Textarea
            placeholder="Write preferred cities, universities, or any detailed notes…"
            value={data.preferredCityUniversity}
            onChange={(e) => onChange({ ...data, preferredCityUniversity: e.target.value })}
            rows={3}
            className="resize-y border-slate-200"
          />
        </div>
      </div>
    </div>
  )
}
