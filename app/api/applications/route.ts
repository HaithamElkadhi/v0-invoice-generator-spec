import { NextResponse } from "next/server"
import { mapApplicationRecord } from "@/lib/application.utils"
import type { ApplicationRecord } from "@/lib/application.types"

const AIRTABLE_API_URL = "https://api.airtable.com/v0"

export async function GET() {
  const token = process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID_2 ?? "appkqvTuc8F0AhWPp"
  const tableId = process.env.AIRTABLE_APPLICATIONS_TABLE_ID ?? "tblGP4mMaQs1XeVME"

  if (!token) {
    return NextResponse.json(
      { error: "Airtable token is not configured. Set AIRTABLE_TOKEN in .env.local" },
      { status: 500 }
    )
  }

  try {
    const records: ApplicationRecord[] = []
    let offset: string | undefined

    do {
      const url = new URL(`${AIRTABLE_API_URL}/${baseId}/${tableId}`)
      url.searchParams.set("pageSize", "100")
      if (offset) url.searchParams.set("offset", offset)

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 0 },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          (errorData as { error?: { message?: string } }).error?.message ||
            `Airtable error ${response.status}`
        )
      }

      const data = await response.json()
      for (const record of data.records ?? []) {
        records.push(mapApplicationRecord(record))
      }
      offset = data.offset
    } while (offset)

    return NextResponse.json({ records })
  } catch (error) {
    console.error("Fetch applications failed:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch applications" },
      { status: 500 }
    )
  }
}
