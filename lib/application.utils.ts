import type {
  ApplicationGlobalStats,
  ApplicationRecord,
  AppStatus,
  StudentStats,
  UniversityStats,
} from "@/lib/application.types"

const APP_STATUSES: AppStatus[] = ["Submitted", "Admitted", "Rejected", "Proposal"]

function isAppStatus(value: string): value is AppStatus {
  return APP_STATUSES.includes(value as AppStatus)
}

function getSelectName(value: unknown): string | null {
  if (value == null || value === "") return null
  if (typeof value === "string") return value.trim() || null
  if (typeof value === "object" && value !== null && "name" in value) {
    const name = (value as { name: unknown }).name
    return name != null ? String(name).trim() || null : null
  }
  return null
}

/** Airtable lookup / text field "Full Name" */
export function getFullName(fields: Record<string, unknown>): string | null {
  const v = fields["Full Name"]
  if (v == null || v === "") return null

  if (typeof v === "string") {
    const name = v.trim()
    return name || null
  }

  if (Array.isArray(v) && v.length > 0) {
    const first = v[0]
    if (typeof first === "string") {
      const name = first.trim()
      return name || null
    }
    if (typeof first === "object" && first !== null && "name" in first) {
      const name = String((first as { name: string }).name).trim()
      return name || null
    }
  }

  if (typeof v === "object" && v !== null && "name" in v) {
    const name = String((v as { name: string }).name).trim()
    return name || null
  }

  const asString = String(v).trim()
  return asString || null
}

function getStudentNameFromLink(fields: Record<string, unknown>): string | null {
  const students = fields["Students"]
  if (Array.isArray(students) && students.length > 0) {
    const first = students[0]
    if (typeof first === "object" && first !== null && "name" in first) {
      const name = String((first as { name: string }).name).trim()
      if (name) return name
    }
  }

  for (const key of ["Student Name", "Student", "Name"]) {
    const val = fields[key]
    if (val != null && String(val).trim()) return String(val).trim()
  }

  return null
}

export function mapApplicationRecord(record: {
  id: string
  fields?: Record<string, unknown>
}): ApplicationRecord {
  const f = record.fields ?? {}
  const statusRaw = getSelectName(f["Application Status"]) ?? "Submitted"
  const status = isAppStatus(statusRaw) ? statusRaw : "Submitted"

  const languageRaw = getSelectName(f["Course Language"])
  const language = languageRaw === "EN" || languageRaw === "IT" ? languageRaw : null

  const degreeRaw = getSelectName(f["Degree Level"])
  const degreeLevel =
    degreeRaw === "Laurea Magistrale" ||
    degreeRaw === "Laurea Triennale" ||
    degreeRaw === "Other"
      ? degreeRaw
      : null

  const fullName = getFullName(f)
  const studentName = fullName ?? getStudentNameFromLink(f) ?? "Unknown"

  return {
    id: record.id,
    university: String(f["University"] ?? "Unknown").trim() || "Unknown",
    fullName,
    studentName,
    course: String(f["Course"] ?? "").trim(),
    language,
    degreeLevel,
    status,
    dateOfCandidacy: f["Date of Candidacy"] ? String(f["Date of Candidacy"]) : null,
    comment: f["Commentaire"] ? String(f["Commentaire"]) : null,
  }
}

export function computeGlobalStats(records: ApplicationRecord[]): ApplicationGlobalStats {
  const total = records.length
  const studentsInProcess = new Set(
    records.map((r) => r.fullName).filter((name): name is string => !!name?.trim())
  ).size
  const submitted = records.filter((r) => r.status === "Submitted").length
  const admitted = records.filter((r) => r.status === "Admitted").length
  const rejected = records.filter((r) => r.status === "Rejected").length
  const proposal = records.filter((r) => r.status === "Proposal").length

  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 1000) / 10 : 0)

  return {
    total,
    studentsInProcess,
    submitted,
    admitted,
    rejected,
    proposal,
    admissionRate: pct(admitted),
    rejectionRate: pct(rejected),
    submittedRate: pct(submitted),
  }
}

export function computeStudentStats(records: ApplicationRecord[]): StudentStats[] {
  const byStudent = new Map<string, StudentStats>()

  for (const record of records) {
    const name = record.fullName ?? record.studentName
    let stats = byStudent.get(name)
    if (!stats) {
      stats = { name, submitted: 0, admitted: 0, rejected: 0, proposal: 0, total: 0 }
      byStudent.set(name, stats)
    }
    stats.total += 1
    if (record.status === "Submitted") stats.submitted += 1
    else if (record.status === "Admitted") stats.admitted += 1
    else if (record.status === "Rejected") stats.rejected += 1
    else if (record.status === "Proposal") stats.proposal += 1
  }

  return Array.from(byStudent.values()).sort((a, b) => b.total - a.total)
}

export function computeUniversityStats(records: ApplicationRecord[], limit = 12): UniversityStats[] {
  const byUni = new Map<string, UniversityStats>()

  for (const record of records) {
    const name = record.university
    let stats = byUni.get(name)
    if (!stats) {
      stats = { name, total: 0, submitted: 0, admitted: 0, rejected: 0, proposal: 0 }
      byUni.set(name, stats)
    }
    stats.total += 1
    if (record.status === "Submitted") stats.submitted += 1
    else if (record.status === "Admitted") stats.admitted += 1
    else if (record.status === "Rejected") stats.rejected += 1
    else if (record.status === "Proposal") stats.proposal += 1
  }

  return Array.from(byUni.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
}

export function getSegmentWidths(s: StudentStats) {
  const total = s.total
  return {
    subPct: total > 0 ? Math.round((s.submitted / total) * 100) : 0,
    admPct: total > 0 ? Math.round((s.admitted / total) * 100) : 0,
    rejPct: total > 0 ? Math.round((s.rejected / total) * 100) : 0,
    proPct: total > 0 ? Math.round((s.proposal / total) * 100) : 0,
  }
}

export function getUniversityBarColor(uni: UniversityStats): string {
  const admRate = uni.total > 0 ? uni.admitted / uni.total : 0
  if (admRate >= 0.15) return "#1D9E75"
  if (admRate >= 0.05) return "#378ADD"
  return "#888780"
}
