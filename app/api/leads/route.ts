import { NextResponse } from "next/server"

const AIRTABLE_API_URL = "https://api.airtable.com/v0"
const AIRTABLE_BASE_ID = "appkqvTuc8F0AhWPp"

type StudentSource = "Lead" | "Prospect"
type StudentRecord = {
  id: string
  source: StudentSource
  fullName: string
  email: string
  phone: string
  nationality: string
}

// Map Airtable field names to our shape (handles common naming variants)
function mapLeadFields(fields: Record<string, unknown>): {
  fullName: string
  email: string
  phone: string
  nationality: string
} {
  const get = (...keys: string[]) => {
    for (const k of keys) {
      const v = fields[k]
      if (v != null && String(v).trim()) return String(v).trim()
    }
    return ""
  }
  return {
    fullName: get("Full Name", "Name", "full name", "name", "Student Name"),
    email: get("Email", "email", "Email Address"),
    phone: get("Phone", "phone", "Phone Number", "Tel", "Mobile"),
    nationality: get("Nationality", "nationality", "Country"),
  }
}

export async function GET() {
  const token = process.env.AIRTABLE_TOKEN

  if (!token) {
    return NextResponse.json(
      {
        error:
          "Airtable token is not configured. Set AIRTABLE_TOKEN in .env.local",
      },
      { status: 500 }
    )
  }

  try {
    const fetchTable = async (tableName: "Leads" | "Prospects", source: StudentSource): Promise<StudentRecord[]> => {
      const students: StudentRecord[] = []
      let offset: string | undefined

      do {
        const url = new URL(`${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${tableName}`)
        url.searchParams.set("pageSize", "100")
        if (offset) url.searchParams.set("offset", offset)

        const response = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error?.message || `Failed to fetch ${tableName} from Airtable`)
        }

        const data = await response.json()
        const records = data.records || []

        for (const record of records) {
          const fields = record.fields || {}
          const mapped = mapLeadFields(fields)
          if (mapped.fullName) {
            students.push({
              id: `${tableName}-${record.id}`,
              source,
              ...mapped,
            })
          }
        }

        offset = data.offset
      } while (offset)

      return students
    }

    const [leads, prospects] = await Promise.all([
      fetchTable("Leads", "Lead"),
      fetchTable("Prospects", "Prospect"),
    ])

    return NextResponse.json({ leads: [...leads, ...prospects] })
  } catch (error) {
    console.error("Fetch leads failed:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch leads" },
      { status: 500 }
    )
  }
}
