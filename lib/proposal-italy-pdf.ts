import jsPDF from "jspdf"
import type { ProposalItalyData } from "./proposal-italy-types"

export async function generateProposalItalyPDF(data: ProposalItalyData): Promise<void> {
  const doc = new jsPDF("p", "mm", "a4")
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - margin * 2
  let y = margin

  const brandColor: [number, number, number] = [41, 84, 144]
  const grayColor: [number, number, number] = [100, 100, 100]
  const lightGray: [number, number, number] = [245, 245, 245]

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-EU", { style: "currency", currency: "EUR" }).format(amount)
  }

  const checkPageBreak = (requiredSpace: number) => {
    if (y + requiredSpace > pageHeight - 25) {
      doc.addPage()
      y = margin
    }
  }

  const drawHeader = () => {
    doc.setFillColor(...brandColor)
    doc.rect(0, 0, pageWidth, 35, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("JEEXPERT", margin, 18)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("Your Academic Journey Abroad Starts Here", margin, 26)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("STUDY PROPOSAL - ITALY", pageWidth - margin, 22, { align: "right" })
    y = 45
  }

  const drawSectionTitle = (title: string) => {
    checkPageBreak(15)
    doc.setFillColor(...brandColor)
    doc.rect(margin, y, contentWidth, 8, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text(title, margin + 3, y + 5.5)
    y += 12
    doc.setTextColor(0, 0, 0)
  }

  const drawField = (label: string, value: string, xOffset = 0, width = contentWidth / 2 - 5) => {
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...grayColor)
    doc.text(label, margin + xOffset, y)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    const lines = doc.splitTextToSize(value || "-", width)
    doc.text(lines, margin + xOffset, y + 4)
    return 4 + lines.length * 4
  }

  // Header
  drawHeader()

  // Section 1: Proposal Information
  drawSectionTitle("1. PROPOSAL INFORMATION")
  const row1Height = Math.max(
    drawField("Proposal Number", data.proposalNumber, 0),
    drawField("Student ID", data.studentId, contentWidth / 2),
  )
  y += row1Height + 2
  const row2Height = Math.max(
    drawField("Proposal Date", formatDate(data.proposalDate), 0),
    drawField("Valid Until", formatDate(data.validUntil), contentWidth / 2),
  )
  y += row2Height + 4

  // Section 2: Student Information
  drawSectionTitle("2. STUDENT INFORMATION")
  const s1 = Math.max(drawField("Full Name", data.studentName, 0), drawField("Email", data.email, contentWidth / 2))
  y += s1 + 2
  const s2 = Math.max(drawField("Phone", data.phone, 0), drawField("Nationality", data.nationality, contentWidth / 2))
  y += s2 + 4

  // Section 3: Client Profile
  drawSectionTitle("3. CLIENT PROFILE")
  const cp1 = Math.max(
    drawField("Last Diploma", data.clientProfile.lastDiploma, 0),
    drawField("Year", data.clientProfile.diplomaYear, contentWidth / 2),
  )
  y += cp1 + 2
  const cp2 = drawField("Field of Study", data.clientProfile.fieldOfStudy, 0, contentWidth)
  y += cp2 + 2
  if (data.clientProfile.notes) {
    const cp3 = drawField("Notes", data.clientProfile.notes, 0, contentWidth)
    y += cp3 + 2
  }

  // Languages table
  if (data.clientProfile.spokenLanguages.length > 0) {
    checkPageBreak(20)
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...grayColor)
    doc.text("Spoken Languages:", margin, y)
    y += 5
    const langColWidth = 50
    doc.setFillColor(...brandColor)
    doc.rect(margin, y, langColWidth, 6, "F")
    doc.rect(margin + langColWidth, y, 30, 6, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.text("Language", margin + 2, y + 4)
    doc.text("Level", margin + langColWidth + 2, y + 4)
    y += 6
    data.clientProfile.spokenLanguages.forEach((lang, i) => {
      const bgColor = i % 2 === 0 ? lightGray : ([255, 255, 255] as [number, number, number])
      doc.setFillColor(...bgColor)
      doc.rect(margin, y, langColWidth, 5, "F")
      doc.rect(margin + langColWidth, y, 30, 5, "F")
      doc.setTextColor(0, 0, 0)
      doc.text(lang.language, margin + 2, y + 3.5)
      doc.text(lang.level, margin + langColWidth + 2, y + 3.5)
      y += 5
    })
    y += 4
  }

  // Section 4: Study Preferences
  drawSectionTitle("4. STUDY PREFERENCES")
  const sp1 = Math.max(
    drawField("Entry Level", data.studyPreferences.entryLevel, 0),
    drawField("Academic Year", data.studyPreferences.academicYear, contentWidth / 2),
  )
  y += sp1 + 2
  const sp2 = drawField("Fields of Study", data.studyPreferences.fieldsOfStudy, 0, contentWidth)
  y += sp2 + 2
  if (data.studyPreferences.specificInterests) {
    const sp3 = drawField("Specific Interests", data.studyPreferences.specificInterests, 0, contentWidth)
    y += sp3 + 2
  }
  if (data.studyPreferences.cityRegionTypes.length > 0) {
    const sp4 = drawField("Preferred Regions", data.studyPreferences.cityRegionTypes.join(", "), 0, contentWidth)
    y += sp4 + 2
  }
  const sp5 = Math.max(
    drawField("Budget", data.studyPreferences.budgetIndication, 0),
    drawField("Other Constraints", data.studyPreferences.otherConstraints, contentWidth / 2),
  )
  y += sp5 + 4

  // Section 5: University Proposals - renumbered to 4
  drawSectionTitle("4. UNIVERSITY PROPOSALS")
  if (data.universityProposals.length > 0) {
    const colWidths = [8, 45, 50, 25, 25, 25]
    const headers = ["#", "University", "Course", "Tuition", "App Fees", "Total"]

    checkPageBreak(30)
    doc.setFillColor(...brandColor)
    doc.rect(margin, y, contentWidth, 7, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont("helvetica", "bold")

    let xPos = margin
    headers.forEach((header, i) => {
      doc.text(header, xPos + 2, y + 5)
      xPos += colWidths[i]
    })
    y += 7

    data.universityProposals.forEach((proposal, index) => {
      checkPageBreak(8)
      const bgColor = index % 2 === 0 ? lightGray : ([255, 255, 255] as [number, number, number])
      doc.setFillColor(...bgColor)
      doc.rect(margin, y, contentWidth, 7, "F")
      doc.setTextColor(0, 0, 0)
      doc.setFont("helvetica", "normal")

      const total = proposal.tuitionFees + proposal.applicationFees
      const rowData = [
        (index + 1).toString(),
        proposal.universityName.substring(0, 22),
        proposal.courseName.substring(0, 25),
        formatCurrency(proposal.tuitionFees),
        formatCurrency(proposal.applicationFees),
        formatCurrency(total),
      ]

      xPos = margin
      rowData.forEach((cell, i) => {
        doc.text(cell, xPos + 2, y + 5)
        xPos += colWidths[i]
      })
      y += 7
    })
    y += 4
  } else {
    doc.setFontSize(9)
    doc.setTextColor(...grayColor)
    doc.text("No universities added.", margin, y)
    y += 8
  }

  drawSectionTitle("5. FINANCIAL SUMMARY")
  checkPageBreak(40)

  doc.setFontSize(10)

  // Estimated University/Application Fees
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("Estimated university/application fees:", margin, y)
  doc.setFont("helvetica", "normal")
  const estFees = data.financialSummary.estimatedUniversityFees || "—"
  doc.text(estFees, margin, y + 5)
  y += 12

  // Jeexpert Upfront Admission Fee
  doc.setFont("helvetica", "bold")
  doc.text("Jeexpert upfront admission fee (non-refundable):", margin, y)
  doc.setFont("helvetica", "normal")
  doc.text(`${data.financialSummary.jeexpertUpfrontFee} €`, margin, y + 5)
  y += 12

  // Jeexpert Additional Fee Upon Acceptance
  doc.setFont("helvetica", "bold")
  doc.text("Jeexpert service fee upon acceptance:", margin, y)
  doc.setFont("helvetica", "normal")
  doc.text(`${data.financialSummary.jeexpertAdditionalFee} €`, margin, y + 5)
  y += 12

  // Additional Financial Notes (only if not empty)
  if (data.financialSummary.additionalFinancialNotes && data.financialSummary.additionalFinancialNotes.trim()) {
    doc.setFont("helvetica", "bold")
    doc.text("Additional financial notes:", margin, y)
    y += 5
    doc.setFont("helvetica", "normal")
    const noteLines = doc.splitTextToSize(data.financialSummary.additionalFinancialNotes, 170)
    noteLines.forEach((line: string) => {
      checkPageBreak(5)
      doc.text(line, margin, y)
      y += 4
    })
    y += 4
  }

  y += 4

  // Section 6: Terms & Conditions
  const hasTerms =
    data.termsConditions.paymentCommitment ||
    data.termsConditions.nonRefundableFees ||
    data.termsConditions.personalDataDelegation ||
    data.termsConditions.additionalTerms

  if (hasTerms) {
    drawSectionTitle("6. TERMS & CONDITIONS")
    doc.setFontSize(9)

    let clauseNumber = 1
    const clauses = [
      { title: "Payment Commitment", content: data.termsConditions.paymentCommitment },
      { title: "Non-Refundable Fees", content: data.termsConditions.nonRefundableFees },
      { title: "Personal Data & Delegation", content: data.termsConditions.personalDataDelegation },
      { title: "Additional Terms", content: data.termsConditions.additionalTerms },
    ]

    clauses.forEach((clause) => {
      if (clause.content && clause.content.trim()) {
        checkPageBreak(15)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(0, 0, 0)
        doc.text(`${clauseNumber}. ${clause.title}`, margin, y)
        y += 5
        doc.setFont("helvetica", "normal")
        const lines = doc.splitTextToSize(clause.content, contentWidth - 5)
        lines.forEach((line: string) => {
          checkPageBreak(5)
          doc.text(line, margin, y)
          y += 4
        })
        y += 3
        clauseNumber++
      }
    })
    y += 4
  }

  // Section 7: Signatures
  checkPageBreak(45)
  drawSectionTitle("7. SIGNATURES")
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")

  const sigWidth = (contentWidth - 10) / 2
  doc.text("Consultant:", margin, y)
  doc.text("Student:", margin + sigWidth + 10, y)
  y += 5
  doc.setFont("helvetica", "bold")
  doc.text(data.consultantName || "________________", margin, y)
  doc.text("________________", margin + sigWidth + 10, y)
  y += 8
  doc.setDrawColor(...grayColor)
  doc.line(margin, y, margin + sigWidth, y)
  doc.line(margin + sigWidth + 10, y, margin + contentWidth, y)
  y += 5
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.text("Signature", margin, y)
  doc.text("Signature", margin + sigWidth + 10, y)
  y += 8
  doc.text("Date: _______________", margin, y)
  doc.text("Date: _______________", margin + sigWidth + 10, y)

  // Footer
  const drawFooter = () => {
    doc.setFillColor(...brandColor)
    doc.rect(0, pageHeight - 12, pageWidth, 12, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.text("Your Academic Journey Abroad Starts Here", pageWidth / 2, pageHeight - 5, { align: "center" })
  }

  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    drawFooter()
  }

  const filename = data.proposalNumber
    ? `Proposal_${data.proposalNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`
    : `Proposal_draft_${new Date().toISOString().split("T")[0]}.pdf`

  doc.save(filename)
}
