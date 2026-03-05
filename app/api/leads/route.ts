import { NextResponse } from "next/server"

const AIRTABLE_API_URL = "https://api.airtable.com/v0"

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
  const baseId = process.env.AIRTABLE_BASE_ID_2

  if (!token || !baseId) {
    return NextResponse.json(
      {
        error:
          "Airtable leads base is not configured. Set AIRTABLE_TOKEN and AIRTABLE_BASE_ID_2 in .env.local",
      },
      { status: 500 }
    )
  }

  try {
    const leads: Array<{ id: string; fullName: string; email: string; phone: string; nationality: string }> = []
    let offset: string | undefined

    do {
      const url = new URL(`${AIRTABLE_API_URL}/${baseId}/Leads`)
      url.searchParams.set("pageSize", "100")
      if (offset) url.searchParams.set("offset", offset)

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return NextResponse.json(
          {
            error:
              errorData.error?.message || "Failed to fetch leads from Airtable",
          },
          { status: response.status }
        )
      }

      const data = await response.json()
      const records = data.records || []

      for (const record of records) {
        const fields = record.fields || {}
        const mapped = mapLeadFields(fields)
        if (mapped.fullName) {
          leads.push({
            id: record.id,
            ...mapped,
          })
        }
      }

      offset = data.offset
    } while (offset)

    return NextResponse.json({ leads })
  } catch (error) {
    console.error("Fetch leads failed:", error)
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    )
  }
}
