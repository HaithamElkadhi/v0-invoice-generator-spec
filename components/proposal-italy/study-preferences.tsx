"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { StudyPreferences } from "@/lib/proposal-italy-types"

interface StudyPreferencesProps {
  data: StudyPreferences
  onChange: (data: StudyPreferences) => void
}

const COUNTRIES = [
  { value: "Italy", label: "Italy" },
  { value: "France", label: "France" },
] as const

const DEGREE_LEVELS_ITALY = [
  { value: "bachelor", label: "Bachelor (Laurea Triennale)" },
  { value: "master", label: "Master (Laurea Magistrale – 2 years)" },
  { value: "master-1y", label: "1-year Master (Master I livello)" },
] as const

const INTAKES = [
  { value: "2026/2027", label: "2026/2027" },
  { value: "2027/2028", label: "2027/2028" },
  { value: "Flexible", label: "Flexible" },
] as const

const ENGLISH_OPTIONS = [
  { value: "english_only", label: "English only" },
  { value: "english_preferred", label: "English preferred but open to Italian" },
  { value: "italian_acceptable", label: "Italian acceptable" },
] as const

const SCHOLARSHIP_DEPENDENT_OPTIONS = [
  { value: "yes_cannot_proceed", label: "Yes – without scholarship I cannot proceed" },
  { value: "prefer_partial", label: "Prefer scholarship but can manage partially" },
  { value: "no", label: "No" },
] as const

const APPLICATION_FEES_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "case_by_case", label: "Case by case" },
  { value: "no", label: "No" },
] as const

const SCHOLARSHIP_STRATEGY_OPTIONS = [
  "DSU Regional Scholarship",
  "MAECI Scholarship",
  "Both",
  "Not sure",
] as const

const CITY_PREFERENCE_OPTIONS = [
  { value: "large_international", label: "Large international city" },
  { value: "student_city", label: "Student city" },
  { value: "affordable_south", label: "Affordable southern region" },
  { value: "no_preference", label: "No preference (best admission chance)" },
] as const

function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
}: {
  name: string
  label: string
  options: readonly { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex flex-col gap-2 rounded-md border border-border bg-muted/30 px-3 py-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-3 text-sm"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="h-4 w-4 border-border text-[rgb(41,84,144)] focus:ring-[rgb(41,84,144)]"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export function StudyPreferencesSection({ data, onChange }: StudyPreferencesProps) {
  const isItaly = data.country === "Italy"

  const toggleScholarshipStrategy = (option: string) => {
    const current = data.scholarshipStrategy || []
    const updated = current.includes(option)
      ? current.filter((s) => s !== option)
      : [...current, option]
    onChange({ ...data, scholarshipStrategy: updated })
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-[rgb(41,84,144)]">
        4. Study Preferences
      </h2>

      <div className="space-y-8">
        {/* Country & degree & intake */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Country</Label>
            <Select
              value={data.country || ""}
              onValueChange={(value) => onChange({ ...data, country: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isItaly && (
            <div className="space-y-2">
              <Label>Target Degree Level</Label>
              <Select
                value={data.targetDegreeLevel || ""}
                onValueChange={(value) =>
                  onChange({ ...data, targetDegreeLevel: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select degree level" />
                </SelectTrigger>
                <SelectContent>
                  {DEGREE_LEVELS_ITALY.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Intended Intake</Label>
            <Select
              value={data.intendedIntake || ""}
              onValueChange={(value) =>
                onChange({ ...data, intendedIntake: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select intake" />
              </SelectTrigger>
              <SelectContent>
                {INTAKES.map((i) => (
                  <SelectItem key={i.value} value={i.value}>
                    {i.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Field of study */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fieldOfStudyPrimary">Field of Study (Primary)</Label>
            <Input
              id="fieldOfStudyPrimary"
              placeholder="e.g. Engineering, Economics, Medicine"
              value={data.fieldOfStudyPrimary}
              onChange={(e) =>
                onChange({ ...data, fieldOfStudyPrimary: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alternativeField">
              Alternative Field <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="alternativeField"
              placeholder="e.g. Data Science, International Relations"
              value={data.alternativeField}
              onChange={(e) =>
                onChange({ ...data, alternativeField: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specificDetailsFieldOfStudy">
              Specific Details About Field of Study
            </Label>
            <Textarea
              id="specificDetailsFieldOfStudy"
              placeholder="Any specific programs, specializations, or interests..."
              value={data.specificDetailsFieldOfStudy}
              onChange={(e) =>
                onChange({ ...data, specificDetailsFieldOfStudy: e.target.value })
              }
              rows={4}
              className="resize-y"
            />
          </div>
        </div>

        {/* English-taught */}
        <RadioGroup
          name="englishTaughtOnly"
          label="Do you require English-taught programs only?"
          options={ENGLISH_OPTIONS}
          value={data.englishTaughtOnly}
          onChange={(value) => onChange({ ...data, englishTaughtOnly: value })}
        />

        {/* Scholarship dependency */}
        <RadioGroup
          name="scholarshipDependent"
          label="Are you dependent on scholarship to study?"
          options={SCHOLARSHIP_DEPENDENT_OPTIONS}
          value={data.scholarshipDependent}
          onChange={(value) => onChange({ ...data, scholarshipDependent: value })}
        />

        {/* Application fees */}
        <RadioGroup
          name="canPayApplicationFees"
          label="Can you pay application fees (30–100€ per university)?"
          options={APPLICATION_FEES_OPTIONS}
          value={data.canPayApplicationFees}
          onChange={(value) => onChange({ ...data, canPayApplicationFees: value })}
        />

        {/* Scholarship & Regional Strategy (checkboxes) */}
        <div className="space-y-3">
          <Label>Scholarship & Regional Strategy</Label>
          <p className="text-muted-foreground text-sm">
            Select all that apply
          </p>
          <div className="flex flex-wrap gap-6 rounded-md border border-border bg-muted/30 px-3 py-3">
            {SCHOLARSHIP_STRATEGY_OPTIONS.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={(data.scholarshipStrategy || []).includes(option)}
                  onCheckedChange={() => toggleScholarshipStrategy(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* City preference */}
        <RadioGroup
          name="cityPreferenceType"
          label="City Preference Type"
          options={CITY_PREFERENCE_OPTIONS}
          value={data.cityPreferenceType}
          onChange={(value) => onChange({ ...data, cityPreferenceType: value })}
        />
      </div>
    </div>
  )
}
