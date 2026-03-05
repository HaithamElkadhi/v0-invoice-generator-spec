"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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

const HIGHEST_DEGREE_OPTIONS = [
  { value: "High School Diploma", label: "High School Diploma" },
  { value: "Bachelor's Degree", label: "Bachelor's Degree" },
  { value: "Master's Degree", label: "Master's Degree" },
  { value: "Other", label: "Other" },
] as const

const ENGLISH_LEVELS = ["A2", "B1", "B2", "C1", "C2"] as const

const ENGLISH_CERTIFICATE_OPTIONS = [
  { value: "IELTS", label: "IELTS" },
  { value: "Duolingo", label: "Duolingo" },
  { value: "TOEFL", label: "TOEFL" },
  { value: "Cambridge", label: "Cambridge" },
  { value: "None", label: "None" },
] as const

const OTHER_LANGUAGES_OPTIONS = [
  "French",
  "Italian",
  "Spanish",
  "German",
  "Arabic",
  "Other",
] as const

export function ClientProfileSection({ data, onChange }: ClientProfileProps) {
  const toggleOtherLanguage = (lang: string) => {
    const current = data.otherLanguages || []
    const updated = current.includes(lang)
      ? current.filter((l) => l !== lang)
      : [...current, lang]
    onChange({ ...data, otherLanguages: updated })
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-[rgb(41,84,144)]">
        3. Student Profile
      </h2>

      <div className="space-y-6">
        {/* Status & education */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Current Status</Label>
            <Select
              value={data.currentStatus || ""}
              onValueChange={(value) => onChange({ ...data, currentStatus: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {CURRENT_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Highest Degree Obtained</Label>
            <Select
              value={data.highestDegreeObtained || ""}
              onValueChange={(value) =>
                onChange({ ...data, highestDegreeObtained: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select degree" />
              </SelectTrigger>
              <SelectContent>
                {HIGHEST_DEGREE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fieldOfPreviousStudies">Field of Previous Studies</Label>
            <Input
              id="fieldOfPreviousStudies"
              placeholder="e.g. Engineering, Economics"
              value={data.fieldOfPreviousStudies}
              onChange={(e) =>
                onChange({ ...data, fieldOfPreviousStudies: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearOfGraduation">Year of Graduation</Label>
            <Input
              id="yearOfGraduation"
              type="number"
              placeholder="YYYY"
              min={1900}
              max={2100}
              value={data.yearOfGraduation}
              onChange={(e) =>
                onChange({ ...data, yearOfGraduation: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentOccupation">Current Occupation</Label>
          <Input
            id="currentOccupation"
            placeholder="e.g. Software Developer, Student"
            value={data.currentOccupation}
            onChange={(e) =>
              onChange({ ...data, currentOccupation: e.target.value })
            }
          />
        </div>

        {/* English */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>English Level (self-estimated)</Label>
            <Select
              value={data.englishLevel || ""}
              onValueChange={(value) => onChange({ ...data, englishLevel: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {ENGLISH_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Do you have an English certificate?</Label>
            <Select
              value={data.englishCertificate || ""}
              onValueChange={(value) =>
                onChange({ ...data, englishCertificate: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select certificate" />
              </SelectTrigger>
              <SelectContent>
                {ENGLISH_CERTIFICATE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Other languages */}
        <div className="space-y-3">
          <Label>Other Languages</Label>
          <p className="text-muted-foreground text-sm">
            Select all that apply
          </p>
          <div className="flex flex-wrap gap-6 rounded-md border border-border bg-muted/30 px-3 py-3">
            {OTHER_LANGUAGES_OPTIONS.map((lang) => (
              <label
                key={lang}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={(data.otherLanguages || []).includes(lang)}
                  onCheckedChange={() => toggleOtherLanguage(lang)}
                />
                <span>{lang}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentProfileNote">Note</Label>
          <Input
            id="studentProfileNote"
            placeholder="Any additional notes..."
            value={data.note}
            onChange={(e) => onChange({ ...data, note: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
