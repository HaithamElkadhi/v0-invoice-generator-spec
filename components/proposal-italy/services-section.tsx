"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { Services } from "@/lib/proposal-italy-types"

interface ServicesSectionProps {
  data: Services
  onChange: (data: Services) => void
}

const SERVICE_OPTIONS = [
  "Admission Standard",
  "Admission Premium",
  "Scholarship",
  "Visa Support",
  "Integration",
  "Elite Pack",
  "Standard Pack",
] as const

export function ServicesSection({ data, onChange }: ServicesSectionProps) {
  const toggleService = (service: string) => {
    const current = data.selected || []
    const updated = current.includes(service)
      ? current.filter((s) => s !== service)
      : [...current, service]
    onChange({ ...data, selected: updated })
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-[rgb(41,84,144)]">
        5. Services
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Select one or more services you are potentially interested in.
      </p>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 rounded-md border border-border bg-muted/30 px-3 py-3">
          {SERVICE_OPTIONS.map((service) => (
            <label
              key={service}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <Checkbox
                checked={(data.selected || []).includes(service)}
                onCheckedChange={() => toggleService(service)}
              />
              <span>{service}</span>
            </label>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="services-note">Note</Label>
          <Input
            id="services-note"
            placeholder="Any additional notes about services..."
            value={data.note}
            onChange={(e) => onChange({ ...data, note: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
