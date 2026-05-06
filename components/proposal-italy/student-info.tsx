"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Search, MessageCircle, User } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import type { ProposalItalyData } from "@/lib/proposal-italy-types"

type Lead = {
  id: string
  source: "Lead" | "Prospect"
  fullName: string
  email: string
  phone: string
  nationality: string
}

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
  const [lastSelectedSource, setLastSelectedSource] = useState<Lead["source"] | null>(null)

  useEffect(() => {
    if (!searchOpen) return
    setLeadsLoading(true)
    setLeadsError(null)
    fetch("/api/leads")
      .then((res) => {
        if (!res.ok) return res.json().then((j) => Promise.reject(j.error || "Failed to fetch"))
        return res.json()
      })
      .then((json) => setLeads(json.leads ?? []))
      .catch((err) => setLeadsError(typeof err === "string" ? err : "Failed to load leads"))
      .finally(() => setLeadsLoading(false))
  }, [searchOpen])

  const filteredLeads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return leads
    return leads.filter((l) => l.fullName.toLowerCase().includes(q))
  }, [leads, searchQuery])

  const handleSelectLead = (lead: Lead) => {
    onChange({ studentName: lead.fullName, email: lead.email, phone: lead.phone, nationality: lead.nationality })
    setLastSelectedSource(lead.source)
    setSearchOpen(false)
    setSearchQuery("")
  }

  const whatsappHref = (phone: string) => `/whatsapp?phone=${encodeURIComponent(phone)}`

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-indigo-600 to-indigo-400" />
      <div className="flex items-center gap-4 px-8 py-6 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Section 2</p>
          <h2 className="text-base font-bold text-slate-800">Student Information</h2>
        </div>
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 flex-shrink-0"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search Airtable</span>
              <span className="sm:hidden">Search</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] flex flex-col sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Search Student in Airtable</DialogTitle>
              <DialogDescription>Select a Lead or Prospect to auto-fill student details.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-1 flex-col gap-3 overflow-hidden">
              <Input
                placeholder="Search by full name…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shrink-0"
                autoFocus
              />
              <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-slate-200">
                {leadsLoading && (
                  <p className="p-4 text-center text-sm text-slate-400">Loading…</p>
                )}
                {!leadsLoading && leadsError && (
                  <p className="p-4 text-center text-sm text-destructive">{leadsError}</p>
                )}
                {!leadsLoading && !leadsError && filteredLeads.length === 0 && (
                  <p className="p-4 text-center text-sm text-slate-400">
                    {leads.length === 0 ? "No students found in Airtable." : "No match for that name."}
                  </p>
                )}
                {!leadsLoading && !leadsError && filteredLeads.length > 0 && (
                  <ul className="divide-y divide-slate-100">
                    {filteredLeads.map((lead) => (
                      <li key={lead.id} className="flex items-center gap-2 hover:bg-slate-50 transition-colors">
                        <button
                          type="button"
                          className="min-w-0 flex-1 px-4 py-3 text-left"
                          onClick={() => handleSelectLead(lead)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-800">{lead.fullName}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                              lead.source === "Lead"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}>
                              {lead.source}
                            </span>
                          </div>
                          {lead.email && <span className="text-xs text-slate-400">{lead.email}</span>}
                        </button>
                        {lead.phone && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0 mr-2 text-[#25D366] hover:bg-[#25D366]/10"
                            asChild
                          >
                            <Link href={whatsappHref(lead.phone)} onClick={(e) => e.stopPropagation()}>
                              <MessageCircle className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {lastSelectedSource && (
      <div className="mx-8 mt-4 flex items-center gap-2 rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <p className="text-xs text-indigo-700">
            Auto-filled from <span className="font-bold">{lastSelectedSource}</span>
          </p>
        </div>
      )}

      <div className="p-8 grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="studentName" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Full Name <span className="text-red-400">*</span>
          </Label>
          <Input
            id="studentName"
            placeholder="Student full name"
            value={data.studentName}
            onChange={(e) => onChange({ studentName: e.target.value })}
            required
            className="h-12 border-slate-200 text-base focus:border-indigo-400 focus:ring-indigo-400/20"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Email <span className="text-red-400">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="student@email.com"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            required
            className="h-12 border-slate-200 text-base focus:border-indigo-400 focus:ring-indigo-400/20"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="phone" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Phone</Label>
            {data.phone?.trim() && (
              <Link
                href={whatsappHref(data.phone)}
                className="flex items-center gap-1 text-[10px] font-semibold text-[#25D366] hover:text-[#1ea852] transition-colors"
              >
                <MessageCircle className="h-3 w-3" /> WhatsApp
              </Link>
            )}
          </div>
          <Input
            id="phone"
            type="tel"
            placeholder="+216 XX XXX XXX"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            className="h-12 border-slate-200 text-base focus:border-indigo-400 focus:ring-indigo-400/20"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nationality" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nationality</Label>
          <Input
            id="nationality"
            placeholder="e.g. Tunisian"
            value={data.nationality}
            onChange={(e) => onChange({ nationality: e.target.value })}
            className="h-12 border-slate-200 text-base focus:border-indigo-400 focus:ring-indigo-400/20"
          />
        </div>
      </div>
    </div>
  )
}
