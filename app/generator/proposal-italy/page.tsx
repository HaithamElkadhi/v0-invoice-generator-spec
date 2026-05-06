"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, FileDown, Mail, Eye, Save, History, Trash2,
  CheckCircle2, CalendarDays, User, GraduationCap, BookOpen,
  Wallet, Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { ProposalHeader } from "@/components/proposal-italy/proposal-header"
import { StudentInfo } from "@/components/proposal-italy/student-info"
import { ClientProfileSection } from "@/components/proposal-italy/client-profile"
import { StudyPreferencesSection } from "@/components/proposal-italy/study-preferences"
import { FinancialSituationSection } from "@/components/proposal-italy/financial-situation"
import { ServicesSection } from "@/components/proposal-italy/services-section"
import { generateProposalItalyPDF } from "@/lib/proposal-italy-pdf"
import { buildProposalEmailBody } from "@/lib/proposal-email-body"
import type { ProposalItalyData } from "@/lib/proposal-italy-types"

const initialData: ProposalItalyData = {
  proposalDate: new Date().toISOString().split("T")[0],
  validUntil: "",
  studentName: "",
  email: "",
  phone: "",
  nationality: "",
  studentProfile: {
    currentStatus: "",
    academicLevel: "",
    obtainedDiploma: [],
    academicRecords: [],
    fieldOfPreviousStudies: "",
    yearOfGraduation: "",
    currentOccupation: "",
    languages: [],
    languageRecords: [],
    note: "",
  },
  studyPreferences: {
    targetDegreeLevel: "",
    intendedIntake: "",
    fieldOfStudyPrimary: "",
    alternativeField: "",
    programLanguages: [],
    financingPlan: "",
    blockedAccount: "",
    hasAbroadSupport: "",
    abroadSupportDetails: "",
    financialGuarantor: "",
    applicationFeesPreference: "",
    projectBudget: "",
    cityPreferenceType: "",
    preferredCityUniversity: "",
  },
  services: { selected: [], note: "" },
}

const PROPOSAL_HISTORY_KEY = "proposal-italy-history-v1"

type SavedProposalItem = {
  id: string
  savedAt: string
  data: ProposalItalyData
}

const FORM_SECTIONS = [
  { id: "proposal-info", label: "Proposal Info", icon: CalendarDays },
  { id: "student-info", label: "Student Info", icon: User },
  { id: "student-profile", label: "Student Profile", icon: GraduationCap },
  { id: "study-preferences", label: "Study Preferences", icon: BookOpen },
  { id: "financial-situation", label: "Financial Situation", icon: Wallet },
  { id: "services", label: "Services", icon: Layers },
] as const

export default function ProposalItalyPage() {
  const [data, setData] = useState<ProposalItalyData>(initialData)
  const [isGenerating, setIsGenerating] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [savedProposals, setSavedProposals] = useState<SavedProposalItem[]>([])
  const [emailForm, setEmailForm] = useState({
    fullName: "",
    email: "",
    additionalEmail: "contact@jeexpert-study.com",
    subject: "Your Study Proposal – Jeexpert",
  })

  const updateData = (updates: Partial<ProposalItalyData>) =>
    setData((prev) => ({ ...prev, ...updates }))

  const completionChecks = [
    Boolean(data.proposalDate),
    Boolean(data.studentName && data.email),
    Boolean(data.studentProfile.academicLevel || data.studentProfile.obtainedDiploma.length > 0),
    Boolean(data.studyPreferences.targetDegreeLevel || data.studyPreferences.fieldOfStudyPrimary),
    Boolean(data.studyPreferences.financingPlan || data.studyPreferences.projectBudget),
    Boolean(data.services.selected.length > 0),
  ]
  const completedSections = completionChecks.filter(Boolean).length

  const loadSavedProposals = () => {
    if (typeof window === "undefined") return
    try {
      const raw = window.localStorage.getItem(PROPOSAL_HISTORY_KEY)
      if (!raw) { setSavedProposals([]); return }
      const parsed = JSON.parse(raw) as SavedProposalItem[]
      setSavedProposals(Array.isArray(parsed) ? parsed : [])
    } catch { setSavedProposals([]) }
  }

  useEffect(() => { loadSavedProposals() }, [])

  const handleSaveProposal = () => {
    try {
      const item: SavedProposalItem = { id: `${Date.now()}`, savedAt: new Date().toISOString(), data }
      const next = [item, ...savedProposals].slice(0, 100)
      setSavedProposals(next)
      window.localStorage.setItem(PROPOSAL_HISTORY_KEY, JSON.stringify(next))
      alert("Proposal saved locally.")
    } catch { alert("Failed to save proposal locally.") }
  }

  const handleLoadProposal = (item: SavedProposalItem) => {
    setData(item.data)
    setHistoryOpen(false)
    alert("Proposal loaded from history.")
  }

  const handleDeleteSavedProposal = (id: string) => {
    try {
      const next = savedProposals.filter((item) => item.id !== id)
      setSavedProposals(next)
      window.localStorage.setItem(PROPOSAL_HISTORY_KEY, JSON.stringify(next))
    } catch { alert("Failed to delete saved proposal.") }
  }

  const handleGeneratePDF = async () => {
    if (!data.studentName || !data.email) {
      alert("Please fill in Student Name and Email first.")
      return
    }
    setIsGenerating(true)
    try {
      await generateProposalItalyPDF(data)
    } catch { alert("Error generating PDF. Please try again.") }
    finally { setIsGenerating(false) }
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailForm.fullName.trim() || !emailForm.email.trim()) {
      alert("Full name and email are required")
      return
    }
    setIsSending(true)
    try {
      const htmlBody = buildProposalEmailBody(data)
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toName: emailForm.fullName.trim(),
          toEmail: emailForm.email.trim(),
          cc: emailForm.additionalEmail.trim(),
          subject: emailForm.subject.trim(),
          body: htmlBody,
        }),
      })
      const json = await res.json()
      if (!res.ok) { alert(json.error || "Failed to send email"); return }
      alert("Email sent successfully.")
      setEmailOpen(false)
    } catch { alert("Failed to send email. Please try again.") }
    finally { setIsSending(false) }
  }

  const handleEmailOpen = (open: boolean) => {
    setEmailOpen(open)
    if (open) {
      setEmailForm((prev) => ({
        ...prev,
        fullName: data.studentName,
        email: data.email,
        additionalEmail: prev.additionalEmail || "contact@jeexpert-study.com",
        subject: prev.subject || "Your Study Proposal – Jeexpert",
      }))
    }
  }

  return (
    <>
      {/* All dialogs at top level */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-h-[80vh] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Saved proposals</DialogTitle>
            <DialogDescription>Saved on this device only. Click to load.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[55vh] space-y-2 overflow-y-auto rounded-xl border p-2">
            {savedProposals.length === 0 && (
              <p className="p-4 text-center text-sm text-muted-foreground">No saved proposals yet.</p>
            )}
            {savedProposals.map((item) => (
              <div key={item.id} className="flex items-center gap-2 rounded-lg border px-3 py-2.5 hover:bg-slate-50 transition-colors">
                <button
                  type="button"
                  onClick={() => handleLoadProposal(item)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-sm font-semibold text-slate-800">{item.data.studentName || "Untitled"}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.data.email || "No email"} · {new Date(item.savedAt).toLocaleString()}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSavedProposal(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={emailOpen} onOpenChange={handleEmailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send proposal by email</DialogTitle>
            <DialogDescription>
              Includes Student info, profile, study preferences and services.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendEmail} className="space-y-4">
            {[
              { id: "email-fullName", label: "Full name", type: "text", key: "fullName", placeholder: "From Student information" },
              { id: "email-address", label: "Email", type: "email", key: "email", placeholder: "From Student information" },
              { id: "email-subject", label: "Subject", type: "text", key: "subject", placeholder: "Email subject" },
              { id: "email-additional", label: "CC", type: "email", key: "additionalEmail", placeholder: "contact@jeexpert-study.com" },
            ].map(({ id, label, type, key, placeholder }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  value={emailForm[key as keyof typeof emailForm]}
                  onChange={(e) => setEmailForm((prev) => ({ ...prev, [key]: e.target.value }))}
                />
              </div>
            ))}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEmailOpen(false)} disabled={isSending}>Cancel</Button>
              <Button type="submit" disabled={isSending} className="bg-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/90">
                {isSending ? "Sending…" : "Send"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Email preview</DialogTitle>
            <DialogDescription>How the email will look to the student.</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border bg-slate-50 px-3 py-2 text-sm space-y-0.5 shrink-0">
            <p><span className="font-semibold text-slate-500">To:</span> {data.studentName || "—"} &lt;{data.email || "—"}&gt;</p>
            <p><span className="font-semibold text-slate-500">Subject:</span> {emailForm.subject}</p>
          </div>
          <div className="rounded-lg border flex-1 min-h-0 overflow-hidden">
            <iframe
              title="Email preview"
              srcDoc={buildProposalEmailBody(data)}
              className="w-full h-full min-h-[400px] border-0"
              sandbox="allow-same-origin"
            />
          </div>
          <DialogFooter className="shrink-0">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
            <Button
              className="bg-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/90"
              onClick={() => { setPreviewOpen(false); handleEmailOpen(true) }}
            >
              <Mail className="mr-2 h-4 w-4" /> Send email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-slate-50">
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Link
                href="/generator"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <Button variant="outline" className="h-11 px-5 text-sm" onClick={handleSaveProposal}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" className="h-11 px-5 text-sm" onClick={() => { loadSavedProposals(); setHistoryOpen(true) }}>
                <History className="mr-2 h-4 w-4" />
                History
              </Button>
              <Button variant="outline" className="h-11 px-5 text-sm" onClick={() => setPreviewOpen(true)}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button variant="outline" className="h-11 px-5 text-sm" onClick={() => handleEmailOpen(true)}>
                <Mail className="mr-2 h-4 w-4" />
                Send email
              </Button>
              <Button onClick={handleGeneratePDF} disabled={isGenerating} className="h-11 bg-[rgb(41,84,144)] px-6 text-sm hover:bg-[rgb(41,84,144)]/90">
                <FileDown className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating…" : "Generate PDF"}
              </Button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-semibold text-[rgb(41,84,144)]">Proposal Progress</p>
              <p className="text-sm text-slate-500">{completedSections}/{FORM_SECTIONS.length} sections done</p>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {FORM_SECTIONS.map((section, idx) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                    completionChecks[idx]
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-100 text-slate-600"
                  }`}
                >
                  {completionChecks[idx] ? <CheckCircle2 className="h-3 w-3" /> : <span>{idx + 1}</span>}
                  {section.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-5xl space-y-8">
            <div id="proposal-info">
              <ProposalHeader data={data} onChange={updateData} />
            </div>
            <div id="student-info">
              <StudentInfo data={data} onChange={updateData} />
            </div>
            <div id="student-profile">
              <ClientProfileSection
                data={data.studentProfile}
                onChange={(studentProfile) => updateData({ studentProfile })}
              />
            </div>
            <div id="study-preferences">
              <StudyPreferencesSection
                data={data.studyPreferences}
                onChange={(studyPreferences) => updateData({ studyPreferences })}
              />
            </div>
            <div id="financial-situation">
              <FinancialSituationSection
                data={data.studyPreferences}
                onChange={(studyPreferences) => updateData({ studyPreferences })}
              />
            </div>
            <div id="services">
              <ServicesSection
                data={data.services}
                onChange={(services) => updateData({ services })}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
