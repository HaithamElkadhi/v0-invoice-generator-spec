"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProposalHeader } from "@/components/proposal-italy/proposal-header"
import { StudentInfo } from "@/components/proposal-italy/student-info"
import { ClientProfileSection } from "@/components/proposal-italy/client-profile"
import { StudyPreferencesSection } from "@/components/proposal-italy/study-preferences"
import { UniversityTable } from "@/components/proposal-italy/university-table"
import { FinancialSummary } from "@/components/proposal-italy/financial-summary"
import { TermsConditionsSection } from "@/components/proposal-italy/terms-conditions"
import { SignatureSection } from "@/components/proposal-italy/signature-section"
import { generateProposalItalyPDF } from "@/lib/proposal-italy-pdf"
import type { ProposalItalyData } from "@/lib/proposal-italy-types"

const initialData: ProposalItalyData = {
  proposalNumber: "",
  studentId: "",
  proposalDate: new Date().toISOString().split("T")[0],
  validUntil: "",
  studentName: "",
  email: "",
  phone: "",
  nationality: "",
  clientProfile: {
    lastDiploma: "",
    diplomaYear: "",
    fieldOfStudy: "",
    notes: "",
    spokenLanguages: [],
  },
  studyPreferences: {
    entryLevel: "",
    academicYear: "",
    fieldsOfStudy: "",
    specificInterests: "",
    cityRegionTypes: [],
    budgetIndication: "",
    otherConstraints: "",
  },
  universityProposals: [],
  financialSummary: {
    estimatedUniversityFees: "",
    jeexpertUpfrontFee: 100,
    jeexpertAdditionalFee: 200,
    additionalFinancialNotes: "",
  },
  termsConditions: {
    paymentCommitment: "",
    nonRefundableFees: "",
    personalDataDelegation: "",
    additionalTerms: "",
  },
  consultantName: "",
}

export default function ProposalItalyPage() {
  const [data, setData] = useState<ProposalItalyData>(initialData)
  const [isGenerating, setIsGenerating] = useState(false)

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/images/jeexpert-20logo-20inversed.png" alt="Jeexpert Logo" className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold text-[rgb(41,84,144)]">Proposal Italy Generator</h1>
                <p className="text-sm text-muted-foreground">Create study abroad proposals</p>
              </div>
            </div>
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
          <ClientProfileSection data={data.clientProfile} onChange={(clientProfile) => updateData({ clientProfile })} />
          <StudyPreferencesSection
            data={data.studyPreferences}
            onChange={(studyPreferences) => updateData({ studyPreferences })}
          />
          <UniversityTable
            proposals={data.universityProposals}
            onChange={(universityProposals) => updateData({ universityProposals })}
          />
          <FinancialSummary
            data={data.financialSummary}
            onChange={(financialSummary) => updateData({ financialSummary })}
          />
          <TermsConditionsSection
            data={data.termsConditions}
            onChange={(termsConditions) => updateData({ termsConditions })}
          />
          <SignatureSection
            consultantName={data.consultantName}
            onChange={(consultantName) => updateData({ consultantName })}
          />
        </div>
      </main>
    </div>
  )
}
