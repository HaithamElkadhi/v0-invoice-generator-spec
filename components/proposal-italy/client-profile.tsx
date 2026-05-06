"use client"

import { GraduationCap } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { StudentProfile } from "@/lib/proposal-italy-types"

interface ClientProfileProps {
  data: StudentProfile
  onChange: (data: StudentProfile) => void
}

const CURRENT_STATUS_OPTIONS = [
  { value: "Student", label: "Student" },
  { value: "Employed", label: "Employed" },
  { value: "Unemployed", label: "Unemployed" },
  { value: "Freelancer", label: "Freelancer" },
] as const

const OBTAINED_DIPLOMA_OPTIONS = [
  { value: "Bac", label: "Bac" },
  { value: "BTS", label: "BTS" },
  { value: "BTP", label: "BTP" },
  { value: "Licence", label: "Licence" },
  { value: "Master", label: "Master" },
  { value: "Engineering Degree", label: "Engineering" },
  { value: "PhD", label: "PhD" },
] as const

const ACADEMIC_LEVEL_OPTIONS = [
  { value: "Pre Bac", label: "Pre Bac" },
  { value: "Bac (en cours)", label: "Bac (en cours)" },
  { value: "Bac accompli", label: "Bac accompli" },
  { value: "Bac +1", label: "Bac +1" },
  { value: "Bac +2 (BTS / BTP / DUT / équivalent)", label: "Bac +2 (BTS/BTP/DUT)" },
  { value: "Bac +3 (en cours)", label: "Bac +3 (en cours)" },
  { value: "Bac +3 accompli (Licence)", label: "Bac +3 (Licence)" },
  { value: "Bac +4 (en cours)", label: "Bac +4 (en cours)" },
  { value: "Bac +5 (en cours – Master)", label: "Bac +5 (en cours)" },
  { value: "Bac +5 accompli (Master)", label: "Bac +5 (Master)" },
  { value: "Bac +6+ (Doctorat / PhD)", label: "Bac +6+ (PhD)" },
] as const

const LANGUAGE_OPTIONS = ["English", "French", "Italian", "Spanish", "German", "Arabic", "Other"] as const
const LANGUAGE_LEVEL_OPTIONS = ["A1", "A2", "B1", "B2", "C1", "C2", "Native"] as const
const LANGUAGE_CERTIFICATE_OPTIONS = ["IELTS", "TOEFL", "TOEIC", "Cambridge", "Duolingo", "DELF", "DALF", "None"] as const

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{children}</p>
  )
}

function PillButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3.5 py-1.5 rounded-lg border text-sm font-medium transition-all",
        selected
          ? "border-violet-500 bg-violet-500 text-white shadow-sm"
          : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      )}
    >
      {children}
    </button>
  )
}

export function ClientProfileSection({ data, onChange }: ClientProfileProps) {
  const selectedDiplomas = Array.isArray(data.obtainedDiploma) ? data.obtainedDiploma : []
  const selectedLanguages = Array.isArray(data.languages) ? data.languages : []
  const academicRecords = data.academicRecords || []
  const languageRecords = data.languageRecords || []

  const updateAcademicRecord = (idx: number, key: "score" | "maxScore", value: string) => {
    const next = academicRecords.map((record, i) => (i === idx ? { ...record, [key]: value } : record))
    onChange({ ...data, academicRecords: next })
  }

  const toggleObtainedDiploma = (diploma: string) => {
    const nextSelected = selectedDiplomas.includes(diploma)
      ? selectedDiplomas.filter((d) => d !== diploma)
      : [...selectedDiplomas, diploma]
    const map = new Map(academicRecords.map((r) => [r.diploma, r]))
    const nextRecords = nextSelected.map((d) => map.get(d) || { diploma: d, score: "", maxScore: "" })
    onChange({ ...data, obtainedDiploma: nextSelected, academicRecords: nextRecords })
  }

  const computeGpa = (score: string, maxScore: string) => {
    const s = Number(score), m = Number(maxScore)
    if (!Number.isFinite(s) || !Number.isFinite(m) || m <= 0) return ""
    return ((s / m) * 4).toFixed(2)
  }

  const toggleLanguage = (language: string) => {
    const nextSelected = selectedLanguages.includes(language)
      ? selectedLanguages.filter((l) => l !== language)
      : [...selectedLanguages, language]
    const map = new Map(languageRecords.map((r) => [r.language, r]))
    const nextRecords = nextSelected.map((lang) => map.get(lang) || { language: lang, level: "", certificate: "" })
    onChange({ ...data, languages: nextSelected, languageRecords: nextRecords })
  }

  const updateLanguageRecord = (idx: number, key: "level" | "certificate", value: string) => {
    const next = languageRecords.map((record, i) => (i === idx ? { ...record, [key]: value } : record))
    onChange({ ...data, languageRecords: next })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-violet-600 to-violet-400" />
      <div className="flex items-center gap-4 px-8 py-6 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">Section 3</p>
          <h2 className="text-base font-bold text-slate-800">Student Profile</h2>
        </div>
        <p className="hidden sm:block text-xs text-slate-400 ml-auto text-right max-w-[200px]">
          Academic background and language profile.
        </p>
      </div>

      <div className="p-8 space-y-10">
        {/* Status & Level */}
        <div>
          <SectionTitle>Status & Education</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Current Status</Label>
              <Select value={data.currentStatus || ""} onValueChange={(v) => onChange({ ...data, currentStatus: v })}>
                <SelectTrigger className="h-11 border-slate-200">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENT_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Academic Level</Label>
              <Select value={data.academicLevel || ""} onValueChange={(v) => onChange({ ...data, academicLevel: v })}>
                <SelectTrigger className="h-11 border-slate-200">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {ACADEMIC_LEVEL_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Diplomas */}
        <div>
          <SectionTitle>Obtained Diplomas</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {OBTAINED_DIPLOMA_OPTIONS.map((opt) => (
              <PillButton
                key={opt.value}
                selected={selectedDiplomas.includes(opt.value)}
                onClick={() => toggleObtainedDiploma(opt.value)}
              >
                {opt.label}
              </PillButton>
            ))}
          </div>
        </div>

        {/* Academic Records */}
        {academicRecords.length > 0 && (
          <div>
            <SectionTitle>Academic Records</SectionTitle>
            <div className="space-y-3">
              {academicRecords.map((record, idx) => (
                <div key={idx} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-12">
                  <div className="space-y-1 sm:col-span-4">
                    <Label className="text-[10px] text-slate-400 uppercase tracking-wide">Diploma</Label>
                    <div className="h-11 flex items-center px-3 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700">
                      {record.diploma}
                    </div>
                  </div>
                  <div className="space-y-1 sm:col-span-3">
                    <Label className="text-[10px] text-slate-400 uppercase tracking-wide">Score</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 14"
                      value={record.score}
                      onChange={(e) => updateAcademicRecord(idx, "score", e.target.value)}
                      className="h-11 border-slate-200"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-3">
                    <Label className="text-[10px] text-slate-400 uppercase tracking-wide">Max</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 20"
                      value={record.maxScore}
                      onChange={(e) => updateAcademicRecord(idx, "maxScore", e.target.value)}
                      className="h-11 border-slate-200"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[10px] text-slate-400 uppercase tracking-wide">GPA</Label>
                    <div className={cn(
                      "h-11 flex items-center justify-center px-3 rounded-lg border text-sm font-bold",
                      computeGpa(record.score, record.maxScore)
                        ? "bg-violet-50 border-violet-200 text-violet-700"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    )}>
                      {computeGpa(record.score, record.maxScore) || "—"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study history */}
        <div>
          <SectionTitle>Study History</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Field of Previous Studies</Label>
              <Input
                placeholder="e.g. Engineering, Economics"
                value={data.fieldOfPreviousStudies}
                onChange={(e) => onChange({ ...data, fieldOfPreviousStudies: e.target.value })}
                className="h-11 border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Year of Graduation</Label>
              <Input
                type="number"
                placeholder="YYYY"
                min={1900}
                max={2100}
                value={data.yearOfGraduation}
                onChange={(e) => onChange({ ...data, yearOfGraduation: e.target.value })}
                className="h-11 border-slate-200"
              />
            </div>
          </div>
        </div>

        {data.currentStatus === "Employed" && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Current Occupation</Label>
            <Input
              placeholder="e.g. Software Developer"
              value={data.currentOccupation}
              onChange={(e) => onChange({ ...data, currentOccupation: e.target.value })}
              className="h-11 border-slate-200"
            />
          </div>
        )}

        {/* Languages */}
        <div>
          <SectionTitle>Language Profile</SectionTitle>
          <div className="flex flex-wrap gap-2 mb-4">
            {LANGUAGE_OPTIONS.map((lang) => (
              <PillButton
                key={lang}
                selected={selectedLanguages.includes(lang)}
                onClick={() => toggleLanguage(lang)}
              >
                {lang}
              </PillButton>
            ))}
          </div>

          {languageRecords.length > 0 && (
            <div className="space-y-3">
              {languageRecords.map((record, idx) => (
                <div key={idx} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-slate-400 uppercase tracking-wide">Language</Label>
                    <div className="h-11 flex items-center px-3 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700">
                      {record.language}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-slate-400 uppercase tracking-wide">Level</Label>
                    <Select value={record.level || ""} onValueChange={(v) => updateLanguageRecord(idx, "level", v)}>
                      <SelectTrigger className="h-11 border-slate-200">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGE_LEVEL_OPTIONS.map((l) => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-slate-400 uppercase tracking-wide">Certificate</Label>
                    <Select value={record.certificate || ""} onValueChange={(v) => updateLanguageRecord(idx, "certificate", v)}>
                      <SelectTrigger className="h-11 border-slate-200">
                        <SelectValue placeholder="Select certificate" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGE_CERTIFICATE_OPTIONS.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Note */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Note</Label>
          <Input
            placeholder="Any additional notes about the student…"
            value={data.note}
            onChange={(e) => onChange({ ...data, note: e.target.value })}
            className="h-11 border-slate-200"
          />
        </div>
      </div>
    </div>
  )
}
