"use client"

import { useState, useEffect, useMemo } from "react"
import { Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ProposalItalyData } from "@/lib/proposal-italy-types"

type Lead = { id: string; fullName: string; email: string; phone: string; nationality: string }

interface StudentInfoProps {
  data: ProposalItalyData
  onChange: (data: Partial<ProposalItalyData>) => void
}

export function StudentInfo({ data, onChange }: StudentInfoProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadsLoading, setLeadsLoading] = useState(false)
  const [leadsError, setLeadsError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!searchOpen) return
    setLeadsLoading(true)
    setLeadsError(null)
    fetch("/api/leads")
      .then((res) => {
        if (!res.ok) return res.json().then((j) => Promise.reject(j.error || "Failed to fetch"))
        return res.json()
      })
      .then((json) => {
        setLeads(json.leads ?? [])
      })
      .catch((err) => {
        setLeadsError(typeof err === "string" ? err : "Failed to load leads")
      })
      .finally(() => setLeadsLoading(false))
  }, [searchOpen])

  const filteredLeads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return leads
    return leads.filter((l) => l.fullName.toLowerCase().includes(q))
  }, [leads, searchQuery])

  const handleSelectLead = (lead: Lead) => {
    onChange({
      studentName: lead.fullName,
      email: lead.email,
      phone: lead.phone,
      nationality: lead.nationality,
    })
    setSearchOpen(false)
    setSearchQuery("")
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-[rgb(41,84,144)]">2. Student Information</h2>
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              Search student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] flex flex-col sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Search student from Airtable</DialogTitle>
              <DialogDescription>
                Choose a lead to fill Student Information automatically.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-1 flex-col gap-3 overflow-hidden">
              <Input
                placeholder="Search by full name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shrink-0"
              />
              <div className="min-h-0 flex-1 overflow-y-auto rounded-md border">
                {leadsLoading && (
                  <p className="p-4 text-center text-sm text-muted-foreground">Loading leads...</p>
                )}
                {!leadsLoading && leadsError && (
                  <p className="p-4 text-center text-sm text-destructive">{leadsError}</p>
                )}
                {!leadsLoading && !leadsError && filteredLeads.length === 0 && (
                  <p className="p-4 text-center text-sm text-muted-foreground">
                    {leads.length === 0 ? "No leads in Airtable." : "No matching name."}
                  </p>
                )}
                {!leadsLoading && !leadsError && filteredLeads.length > 0 && (
                  <ul className="divide-y">
                    {filteredLeads.map((lead) => (
                      <li key={lead.id}>
                        <button
                          type="button"
                          className="w-full px-4 py-3 text-left text-sm hover:bg-muted/50"
                          onClick={() => handleSelectLead(lead)}
                        >
                          <span className="font-medium">{lead.fullName}</span>
                          {lead.email && (
                            <span className="ml-2 text-muted-foreground">{lead.email}</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="studentName">Full Name *</Label>
          <Input
            id="studentName"
            placeholder="Student full name"
            value={data.studentName}
            onChange={(e) => onChange({ studentName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="student@email.com"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+216 XX XXX XXX"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            placeholder="e.g., Tunisian"
            value={data.nationality}
            onChange={(e) => onChange({ nationality: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
