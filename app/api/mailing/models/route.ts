import { NextResponse } from "next/server"
import type { MailingModelRecord } from "@/lib/mailing-types"

const AIRTABLE_API_URL = "https://api.airtable.com/v0"

/** Table in base 3 (Italy base) for mailing templates */
const ITALY_TABLE_NAME = "Italy"

function getField<T>(fields: Record<string, unknown>, ...keys: string[]): T | undefined {
  for (const key of keys) {
    const v = fields[key]
    if (v !== undefined && v !== null && v !== "") return v as T
  }
  return undefined
}

export async function GET() {
  const token = process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID_3

  if (!token || !baseId) {
    return NextResponse.json(
      {
        error:
          "Airtable is not configured. Set AIRTABLE_TOKEN and AIRTABLE_BASE_ID_3 in .env.local",
      },
      { status: 500 }
    )
  }

  const pathTable = encodeURIComponent(ITALY_TABLE_NAME)

  try {
    const records: MailingModelRecord[] = []
    let offset: string | undefined

    do {
      const url = new URL(`${AIRTABLE_API_URL}/${baseId}/${pathTable}`)
      url.searchParams.set("pageSize", "100")
      if (offset) url.searchParams.set("offset", offset)

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const msg =
          (errorData.error?.message as string) ||
          "Failed to fetch mailing models from Airtable"
        return NextResponse.json(
          {
            error: msg,
            hint: `Ensure the "${ITALY_TABLE_NAME}" table exists in your base and your token has read access.`,
          },
          { status: response.status }
        )
      }

      const data = (await response.json()) as {
        records?: { id: string; fields?: Record<string, unknown> }[]
        offset?: string
      }
      const rawRecords = data.records || []

      for (const record of rawRecords) {
        const fields = record.fields || {}
        const modelName =
          getField<string>(fields, "Model Name", "ModelName", "model_name", "Name") ?? ""
        const subject = getField<string>(fields, "Subject", "subject") ?? ""
        const message = getField<string>(fields, "Message", "message") ?? ""
        const rawAttachments = fields["Attachments"] ?? fields["attachments"]
        let attachments: { url: string; filename?: string }[] = []
        if (Array.isArray(rawAttachments)) {
          attachments = rawAttachments
            .filter((a: unknown) => a && typeof a === "object" && "url" in (a as object))
            .map((a: unknown) => {
              const x = a as { url?: string; filename?: string }
              return { url: x.url || "", filename: x.filename }
            })
        }

        records.push({
          id: record.id,
          modelName: String(modelName).trim(),
          subject: String(subject).trim(),
          message: String(message).trim(),
          attachments,
        })
      }

      offset = data.offset
    } while (offset)

    return NextResponse.json({ records })
  } catch (error) {
    console.error("Fetch mailing models failed:", error)
    return NextResponse.json(
      { error: "Failed to fetch mailing models" },
      { status: 500 }
    )
  }
}
