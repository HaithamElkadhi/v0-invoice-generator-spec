"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"
import type { ClientProfile, SpokenLanguage } from "@/lib/proposal-italy-types"

interface ClientProfileProps {
  data: ClientProfile
  onChange: (data: ClientProfile) => void
}

const LANGUAGE_OPTIONS = ["English", "Italian", "French", "Spanish", "German", "Arabic"]
const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const

export function ClientProfileSection({ data, onChange }: ClientProfileProps) {
  const addLanguage = () => {
    onChange({
      ...data,
      spokenLanguages: [...data.spokenLanguages, { language: "", level: "A1" }],
    })
  }

  const removeLanguage = (index: number) => {
    onChange({
      ...data,
      spokenLanguages: data.spokenLanguages.filter((_, i) => i !== index),
    })
  }

  const updateLanguage = (index: number, field: keyof SpokenLanguage, value: string) => {
    const updated = [...data.spokenLanguages]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, spokenLanguages: updated })
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">3. Client Profile</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lastDiploma">Last Diploma Obtained</Label>
          <Input
            id="lastDiploma"
            placeholder="e.g., Baccalaureate, Bachelor's Degree"
            value={data.lastDiploma}
            onChange={(e) => onChange({ ...data, lastDiploma: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diplomaYear">Year of Diploma</Label>
          <Input
            id="diplomaYear"
            placeholder="e.g., 2023"
            value={data.diplomaYear}
            onChange={(e) => onChange({ ...data, diplomaYear: e.target.value })}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="fieldOfStudy">Field of Study</Label>
          <Input
            id="fieldOfStudy"
            placeholder="e.g., Computer Science, Business Administration"
            value={data.fieldOfStudy}
            onChange={(e) => onChange({ ...data, fieldOfStudy: e.target.value })}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="profileNotes">Notes</Label>
          <Textarea
            id="profileNotes"
            placeholder="Additional notes about the student's background..."
            value={data.notes}
            onChange={(e) => onChange({ ...data, notes: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      {/* Spoken Languages */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <Label>Spoken Languages</Label>
          <Button type="button" variant="outline" size="sm" onClick={addLanguage}>
            <Plus className="mr-1 h-4 w-4" />
            Add Language
          </Button>
        </div>
        <div className="space-y-2">
          {data.spokenLanguages.map((lang, index) => (
            <div key={index} className="flex items-center gap-2">
              <Select value={lang.language} onValueChange={(value) => updateLanguage(index, "language", value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Or type custom"
                value={LANGUAGE_OPTIONS.includes(lang.language) ? "" : lang.language}
                onChange={(e) => updateLanguage(index, "language", e.target.value)}
                className="flex-1"
              />
              <Select
                value={lang.level}
                onValueChange={(value) => updateLanguage(index, "level", value as SpokenLanguage["level"])}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CEFR_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeLanguage(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {data.spokenLanguages.length === 0 && (
            <p className="text-sm text-muted-foreground">No languages added yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
