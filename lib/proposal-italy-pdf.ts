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

  // Section 3: Student Profile
  drawSectionTitle("3. STUDENT PROFILE")
  const spro = data.studentProfile
  const cp1 = Math.max(
    drawField("Current Status", spro.currentStatus || "-", 0),
    drawField("Highest Degree Obtained", spro.highestDegreeObtained || "-", contentWidth / 2),
  )
  y += cp1 + 2
  const cp2 = Math.max(
    drawField("Field of Previous Studies", spro.fieldOfPreviousStudies || "-", 0),
    drawField("Year of Graduation", spro.yearOfGraduation || "-", contentWidth / 2),
  )
  y += cp2 + 2
  const cp3 = Math.max(
    drawField("Current Occupation", spro.currentOccupation || "-", 0),
    drawField("English Level", spro.englishLevel || "-", contentWidth / 2),
  )
  y += cp3 + 2
  const cp4 = Math.max(
    drawField("English Certificate", spro.englishCertificate || "-", 0),
    drawField("Other Languages", spro.otherLanguages?.length ? spro.otherLanguages.join(", ") : "-", contentWidth / 2),
  )
  y += cp4 + 2
  const cp5 = drawField("Note", spro.note || "-", 0, contentWidth)
  y += cp5 + 4

  // Section 4: Study Preferences
  drawSectionTitle("4. STUDY PREFERENCES")
  const sp = data.studyPreferences
  const degreeLabels: Record<string, string> = {
    bachelor: "Bachelor (Laurea Triennale)",
    master: "Master (Laurea Magistrale – 2 years)",
    "master-1y": "1-year Master (Master I livello)",
  }
  const englishLabels: Record<string, string> = {
    english_only: "English only",
    english_preferred: "English preferred but open to Italian",
    italian_acceptable: "Italian acceptable",
  }
  const scholarshipDepLabels: Record<string, string> = {
    yes_cannot_proceed: "Yes – without scholarship I cannot proceed",
    prefer_partial: "Prefer scholarship but can manage partially",
    no: "No",
  }
  const appFeesLabels: Record<string, string> = {
    yes: "Yes",
    case_by_case: "Case by case",
    no: "No",
  }
  const cityLabels: Record<string, string> = {
    large_international: "Large international city",
    student_city: "Student city",
    affordable_south: "Affordable southern region",
    no_preference: "No preference (best admission chance)",
  }

  const sp1 = Math.max(
    drawField("Country", sp.country || "-", 0),
    drawField("Intended Intake", sp.intendedIntake || "-", contentWidth / 2),
  )
  y += sp1 + 2
  const targetDegreeLabel =
    sp.country === "Italy" && sp.targetDegreeLevel
      ? degreeLabels[sp.targetDegreeLevel] || sp.targetDegreeLevel
      : "-"
  const sp2 = drawField("Target Degree Level", targetDegreeLabel, 0, contentWidth)
  y += sp2 + 2
  const sp3 = drawField("Field of Study (Primary)", sp.fieldOfStudyPrimary || "-", 0, contentWidth)
  y += sp3 + 2
  const sp4 = drawField("Alternative Field", sp.alternativeField || "-", 0, contentWidth)
  y += sp4 + 2
  const sp5 = drawField(
    "Specific Details About Field of Study",
    sp.specificDetailsFieldOfStudy || "-",
    0,
    contentWidth
  )
  y += sp5 + 2
  const sp6 = drawField(
    "English-taught programs",
    sp.englishTaughtOnly ? englishLabels[sp.englishTaughtOnly] || sp.englishTaughtOnly : "-",
    0,
    contentWidth
  )
  y += sp6 + 2
  const sp7 = drawField(
    "Dependent on scholarship",
    sp.scholarshipDependent ? scholarshipDepLabels[sp.scholarshipDependent] || sp.scholarshipDependent : "-",
    0,
    contentWidth
  )
  y += sp7 + 2
  const sp8 = drawField(
    "Can pay application fees",
    sp.canPayApplicationFees ? appFeesLabels[sp.canPayApplicationFees] || sp.canPayApplicationFees : "-",
    0,
    contentWidth
  )
  y += sp8 + 2
  const sp9 = drawField(
    "Scholarship & Regional Strategy",
    sp.scholarshipStrategy?.length ? sp.scholarshipStrategy.join(", ") : "-",
    0,
    contentWidth
  )
  y += sp9 + 2
  const sp10 = drawField(
    "City Preference Type",
    sp.cityPreferenceType ? cityLabels[sp.cityPreferenceType] || sp.cityPreferenceType : "-",
    0,
    contentWidth
  )
  y += sp10 + 4

  // Section 5: Services
  drawSectionTitle("5. SERVICES")
  const svc = data.services
  const svc1 = drawField(
    "Services selected",
    svc?.selected?.length ? svc.selected.join(", ") : "-",
    0,
    contentWidth
  )
  y += svc1 + 2
  const svc2 = drawField("Note", svc?.note?.trim() || "-", 0, contentWidth)
  y += svc2 + 4

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
