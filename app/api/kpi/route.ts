import { NextResponse } from "next/server"
import type { KpiSnapshot } from "@/lib/kpi.types"

const AIRTABLE_API_URL = "https://api.airtable.com/v0"

function mapRecord(record: {
  id: string
  fields: Record<string, unknown>
}): KpiSnapshot {
  const f = record.fields
  return {
    id: record.id,
    snapshotId: Number(f["ID"] ?? 0),
    createdAt: String(f["Date de création"] ?? ""),
    totalProspect: Number(f["Total_Prospect"] ?? 0),
    potential: Number(f["Potential"] ?? 0),
    serious: Number(f["Serious"] ?? 0),
    undecided: Number(f["Undecided"] ?? 0),
    engaged: Number(f["Engaged"] ?? 0),
    admitted: Number(f["Admitted"] ?? 0),
    completed: Number(f["Completed"] ?? 0),
    lastChance: Number(f["Last_chance"] ?? 0),
    lost: Number(f["Lost"] ?? 0),
    originalFolder: Number(f["Original_Folder"] ?? 0),
    translatedFolder: Number(f["Translated_Folder"] ?? 0),
  }
}

export async function GET() {
  const token = process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID_2 ?? "appkqvTuc8F0AhWPp"
  const tableId = process.env.AIRTABLE_KPI_TABLE_ID ?? "tblKH18HxeyAND7Ew"

  if (!token) {
    return NextResponse.json(
      { error: "Airtable token is not configured. Set AIRTABLE_TOKEN in .env.local" },
      { status: 500 }
    )
  }

  try {
    const snapshots: KpiSnapshot[] = []
    let offset: string | undefined

    do {
      const url = new URL(`${AIRTABLE_API_URL}/${baseId}/${tableId}`)
      url.searchParams.set("sort[0][field]", "Date de création")
      url.searchParams.set("sort[0][direction]", "asc")
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
      const records = data.records ?? []
      for (const record of records) {
        snapshots.push(mapRecord(record))
      }
      offset = data.offset
    } while (offset)

    return NextResponse.json({ snapshots })
  } catch (error) {
    console.error("Fetch KPI snapshots failed:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch KPI data" },
      { status: 500 }
    )
  }
}
