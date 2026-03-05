"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileDown, Mail, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProposalHeader } from "@/components/proposal-italy/proposal-header"
import { StudentInfo } from "@/components/proposal-italy/student-info"
import { ClientProfileSection } from "@/components/proposal-italy/client-profile"
import { StudyPreferencesSection } from "@/components/proposal-italy/study-preferences"
import { ServicesSection } from "@/components/proposal-italy/services-section"
import { generateProposalItalyPDF } from "@/lib/proposal-italy-pdf"
import { buildProposalEmailBody } from "@/lib/proposal-email-body"
import type { ProposalItalyData } from "@/lib/proposal-italy-types"
import { getPictureUrl, PICTURE_LABELS } from "@/lib/pictures"

const initialData: ProposalItalyData = {
  proposalNumber: "",
  studentId: "",
  proposalDate: new Date().toISOString().split("T")[0],
  validUntil: "",
  studentName: "",
  email: "",
  phone: "",
  nationality: "",
  studentProfile: {
    currentStatus: "",
    highestDegreeObtained: "",
    fieldOfPreviousStudies: "",
    yearOfGraduation: "",
    currentOccupation: "",
    englishLevel: "",
    englishCertificate: "",
    otherLanguages: [],
    note: "",
  },
  studyPreferences: {
    country: "",
    targetDegreeLevel: "",
    intendedIntake: "",
    fieldOfStudyPrimary: "",
    alternativeField: "",
    specificDetailsFieldOfStudy: "",
    englishTaughtOnly: "",
    scholarshipDependent: "",
    canPayApplicationFees: "",
    scholarshipStrategy: [],
    cityPreferenceType: "",
  },
  services: {
    selected: [],
    note: "",
  },
}

export default function ProposalItalyPage() {
  const [data, setData] = useState<ProposalItalyData>(initialData)
  const [isGenerating, setIsGenerating] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [emailForm, setEmailForm] = useState({
    fullName: "",
    email: "",
    subject: "Your Study Proposal – Jeexpert",
  })

  const updateData = (updates: Partial<ProposalItalyData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const handleGeneratePDF = async () => {
    if (!data.studentName || !data.email) {
      alert("Please fill in the required fields: Student Name and Email")
      return
    }
    setIsGenerating(true)
    try {
      await generateProposalItalyPDF(data)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
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
          subject: emailForm.subject.trim(),
          body: htmlBody,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        alert(json.error || "Failed to send email")
        return
      }
      alert("Email sent successfully.")
      setEmailOpen(false)
      setEmailForm((prev) => ({ ...prev, fullName: "", email: "" }))
    } catch (err) {
      console.error("Send email error:", err)
      alert("Failed to send email. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const handleEmailOpenChange = (open: boolean) => {
    setEmailOpen(open)
    if (open) {
      setEmailForm((prev) => ({
        ...prev,
        fullName: data.studentName,
        email: data.email,
        subject: prev.subject || "Your Study Proposal – Jeexpert",
      }))
    }
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={getPictureUrl(PICTURE_LABELS.LogoApp)} alt="Jeexpert Logo" className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold text-[rgb(41,84,144)]">Proposal Italy Generator</h1>
                <p className="text-sm text-muted-foreground">Create study abroad proposals</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={emailOpen} onOpenChange={handleEmailOpenChange}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-[rgb(41,84,144)] text-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/10"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send email
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Send proposal by email</DialogTitle>
                    <DialogDescription>
                      Recipient is taken from Student information. The email will include a formatted summary of Student information, Student profile, Study preferences and Services.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSendEmail} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-fullName">Full name</Label>
                      <Input
                        id="email-fullName"
                        placeholder="From Student information"
                        value={emailForm.fullName}
                        onChange={(e) =>
                          setEmailForm((prev) => ({ ...prev, fullName: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-address">Email</Label>
                      <Input
                        id="email-address"
                        type="email"
                        placeholder="From Student information"
                        value={emailForm.email}
                        onChange={(e) =>
                          setEmailForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-subject">Subject</Label>
                      <Input
                        id="email-subject"
                        placeholder="Email subject"
                        value={emailForm.subject}
                        onChange={(e) =>
                          setEmailForm((prev) => ({ ...prev, subject: e.target.value }))
                        }
                      />
                    </div>
                    <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                      The message will include: <strong className="text-foreground">Student information</strong>, <strong className="text-foreground">Student profile</strong>, <strong className="text-foreground">Study preferences</strong> and <strong className="text-foreground">Services</strong> in a clear layout.
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEmailOpen(false)}
                        disabled={isSending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSending}
                        className="bg-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/90"
                      >
                        {isSending ? "Sending..." : "Send"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                type="button"
                variant="outline"
                className="border-[rgb(41,84,144)] text-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/10"
                onClick={() => setPreviewOpen(true)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Email preview</DialogTitle>
                    <DialogDescription>
                      This is how the email will look when sent to the student.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 overflow-hidden flex flex-col min-h-0">
                    <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm space-y-1 shrink-0">
                      <p><span className="font-semibold text-muted-foreground">To:</span> {data.studentName || "—"} &lt;{data.email || "—"}&gt;</p>
                      <p><span className="font-semibold text-muted-foreground">Subject:</span> {emailForm.subject || "Your Study Proposal – Jeexpert"}</p>
                    </div>
                    <div className="rounded-md border border-border bg-muted/20 flex-1 min-h-0 flex flex-col overflow-hidden">
                      <iframe
                        title="Email content preview"
                        srcDoc={buildProposalEmailBody(data)}
                        className="w-full flex-1 min-h-[400px] border-0 rounded-md"
                        sandbox="allow-same-origin"
                      />
                    </div>
                  </div>
                  <DialogFooter className="shrink-0">
                    <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                      Close
                    </Button>
                    <Button
                      className="bg-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/90"
                      onClick={() => {
                        setPreviewOpen(false)
                        setEmailOpen(true)
                        handleEmailOpenChange(true)
                      }}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Send email
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="bg-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/90"
              >
                <FileDown className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate PDF"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/generator"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[rgb(41,84,144)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Generator
        </Link>

        <div className="space-y-6">
          <ProposalHeader data={data} onChange={updateData} />
          <StudentInfo data={data} onChange={updateData} />
          <ClientProfileSection data={data.studentProfile} onChange={(studentProfile) => updateData({ studentProfile })} />
          <StudyPreferencesSection
            data={data.studyPreferences}
            onChange={(studyPreferences) => updateData({ studyPreferences })}
          />
          <ServicesSection
            data={data.services}
            onChange={(services) => updateData({ services })}
          />
        </div>
      </main>
    </div>
  )
}
