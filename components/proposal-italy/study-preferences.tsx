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

const ENTRY_LEVELS = ["Bachelor", "Master", "PhD", "Language Course", "Foundation Year", "Other"]
const CITY_REGION_TYPES = [
  "Large City",
  "Medium City",
  "Small Town",
  "Northern Italy",
  "Central Italy",
  "Southern Italy",
]

export function StudyPreferencesSection({ data, onChange }: StudyPreferencesProps) {
  const toggleCityRegion = (type: string) => {
    const current = data.cityRegionTypes || []
    const updated = current.includes(type) ? current.filter((t) => t !== type) : [...current, type]
    onChange({ ...data, cityRegionTypes: updated })
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">4. Study Preferences</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="entryLevel">Entry Level</Label>
          <Select value={data.entryLevel} onValueChange={(value) => onChange({ ...data, entryLevel: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {ENTRY_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="academicYear">Academic Year</Label>
          <Input
            id="academicYear"
            placeholder="e.g., 2024/2025"
            value={data.academicYear}
            onChange={(e) => onChange({ ...data, academicYear: e.target.value })}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="fieldsOfStudy">Fields of Study</Label>
          <Input
            id="fieldsOfStudy"
            placeholder="e.g., Engineering, Medicine, Business"
            value={data.fieldsOfStudy}
            onChange={(e) => onChange({ ...data, fieldsOfStudy: e.target.value })}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="specificInterests">Specific Interests</Label>
          <Textarea
            id="specificInterests"
            placeholder="Any specific programs, universities, or interests..."
            value={data.specificInterests}
            onChange={(e) => onChange({ ...data, specificInterests: e.target.value })}
            rows={2}
          />
        </div>

        {/* City/Region Preferences */}
        <div className="space-y-3 sm:col-span-2">
          <Label>Preferred City/Region Types</Label>
          <div className="flex flex-wrap gap-4">
            {CITY_REGION_TYPES.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={(data.cityRegionTypes || []).includes(type)}
                  onCheckedChange={() => toggleCityRegion(type)}
                />
                <label htmlFor={type} className="text-sm">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budgetIndication">Budget Indication</Label>
          <Input
            id="budgetIndication"
            placeholder="e.g., 5000-10000 EUR/year"
            value={data.budgetIndication}
            onChange={(e) => onChange({ ...data, budgetIndication: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="otherConstraints">Other Constraints</Label>
          <Input
            id="otherConstraints"
            placeholder="e.g., Must have English-taught programs"
            value={data.otherConstraints}
            onChange={(e) => onChange({ ...data, otherConstraints: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
