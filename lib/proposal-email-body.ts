import type { ProposalItalyData } from "./proposal-italy-types"

const DEGREE_LABELS: Record<string, string> = {
  bachelor: "Bachelor (Laurea Triennale)",
  master: "Master (Laurea Magistrale – 2 years)",
  "master-1y": "1-year Master (Master I livello)",
}

const ENGLISH_LABELS: Record<string, string> = {
  english_only: "English only",
  english_preferred: "English preferred but open to Italian",
  italian_acceptable: "Italian acceptable",
}

const SCHOLARSHIP_DEP_LABELS: Record<string, string> = {
  yes_cannot_proceed: "Yes – without scholarship I cannot proceed",
  prefer_partial: "Prefer scholarship but can manage partially",
  no: "No",
}

const APP_FEES_LABELS: Record<string, string> = {
  yes: "Yes",
  case_by_case: "Case by case",
  no: "No",
}

const CITY_LABELS: Record<string, string> = {
  large_international: "Large international city",
  student_city: "Student city",
  affordable_south: "Affordable southern region",
  no_preference: "No preference (best admission chance)",
}

function row(label: string, value: string): string {
  if (!value?.trim()) return ""
  return `
    <tr>
      <td style="padding:4px 12px 4px 0;vertical-align:top;font-size:14px;color:#374151;">${escapeHtml(label)}</td>
      <td style="padding:4px 0;font-size:14px;color:#111;">${escapeHtml(value)}</td>
    </tr>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function sectionTitle(title: string): string {
  return `<p style="margin:20px 0 8px;font-size:14px;font-weight:700;color:#111;">${escapeHtml(title)}</p>`
}

export function buildProposalEmailBody(data: ProposalItalyData): string {
  const sp = data.studentProfile
  const prefs = data.studyPreferences

  const studentInfoRows = [
    row("Full name", data.studentName),
    row("Email", data.email),
    row("Phone", data.phone),
    row("Nationality", data.nationality),
  ].filter(Boolean)

  const profileRows = [
    row("Current status", sp.currentStatus),
    row("Highest degree obtained", sp.highestDegreeObtained),
    row("Field of previous studies", sp.fieldOfPreviousStudies),
    row("Year of graduation", sp.yearOfGraduation),
    row("Current occupation", sp.currentOccupation),
    row("English level", sp.englishLevel),
    row("English certificate", sp.englishCertificate),
    row("Other languages", sp.otherLanguages?.length ? sp.otherLanguages.join(", ") : ""),
    row("Note", sp.note),
  ].filter(Boolean)

  const degreeLabel = prefs.country === "Italy" && prefs.targetDegreeLevel
    ? (DEGREE_LABELS[prefs.targetDegreeLevel] || prefs.targetDegreeLevel)
    : ""
  const svc = data.services
  const servicesRows = [
    row("Services", svc?.selected?.length ? svc.selected.join(", ") : ""),
    row("Note", svc?.note || ""),
  ].filter(Boolean)

  const prefsRows = [
    row("Country", prefs.country),
    ...(degreeLabel ? [row("Target degree level", degreeLabel)] : []),
    row("Intended intake", prefs.intendedIntake),
    row("Field of study (primary)", prefs.fieldOfStudyPrimary),
    row("Alternative field", prefs.alternativeField),
    row("Specific details", prefs.specificDetailsFieldOfStudy),
    row("English-taught programs", prefs.englishTaughtOnly ? (ENGLISH_LABELS[prefs.englishTaughtOnly] || prefs.englishTaughtOnly) : ""),
    row("Dependent on scholarship", prefs.scholarshipDependent ? (SCHOLARSHIP_DEP_LABELS[prefs.scholarshipDependent] || prefs.scholarshipDependent) : ""),
    row("Can pay application fees", prefs.canPayApplicationFees ? (APP_FEES_LABELS[prefs.canPayApplicationFees] || prefs.canPayApplicationFees) : ""),
    row("Scholarship & regional strategy", prefs.scholarshipStrategy?.length ? prefs.scholarshipStrategy.join(", ") : ""),
    row("City preference", prefs.cityPreferenceType ? (CITY_LABELS[prefs.cityPreferenceType] || prefs.cityPreferenceType) : ""),
  ].filter(Boolean)

  const tableStyle = "width:100%;border-collapse:collapse;font-family:Arial,sans-serif;"
  const table = (rows: string[]) =>
    rows.length ? `<table style="${tableStyle}">${rows.join("")}</table>` : ""

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#111;">
  <p style="margin:0 0 16px;">
    Dear ${escapeHtml(data.studentName || "Student")},
  </p>
  <p style="margin:0 0 16px;">
    Please find below your study proposal details.
  </p>

  ${studentInfoRows.length ? sectionTitle("Student information") + table(studentInfoRows) : ""}
  ${profileRows.length ? sectionTitle("Student profile") + table(profileRows) : ""}
  ${prefsRows.length ? sectionTitle("Study preferences") + table(prefsRows) : ""}
  ${servicesRows.length ? sectionTitle("Services") + table(servicesRows) : ""}

  <p style="margin:24px 0 0;">
    Best regards,<br/>
    Jeexpert
  </p>
</body>
</html>`.trim()
}
