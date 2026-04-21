import { NextResponse } from "next/server"

const AIRTABLE_API_URL = "https://api.airtable.com/v0"
const PAIEMENTS_TABLE_ID = "tblT2XDNBcvOfA4kj"

const FIELDS = {
  reference: "fldQlNU3kjqvzoU2y",
  prospects: "fldE5eklvFyL7SCjH",
  fullName: "fldfszLfQiVbeVxfR",
  email: "fldb8FA1RbCfSe5Ho",
  amount: "fldT0d71Hb2BovtNe",
  currency: "fldjJfDqfKn8UXXk2",
  purpose: "fld9KboGTSzoziodS",
  status: "fldlCsQTRymR9vWee",
  dueDate: "fldGCAnWh8Yb1gnpA",
  paymentDate: "fldKabgKdceocbDRc",
  invoice: "fldy0JFBVkYmOmZTT",
  comment: "fldLxiPmfh0gFzpZw",
  exemptionReason: "fldW9VWGY1VRoqSD8",
  prospectId: "fld1YE6eeDJPG0wHR",
  paymentMethod: "fldRXyV7ll1jgMwyW",
  billingAddress: "fld2HUwf8StFqIMla",
  proofOfPayment: "fldLG0u4INznvhroy",
  lastModified: "fldjmKO5BXHZVpA4C",
} as const

type AirtableAttachment = {
  id?: string
  url?: string
  filename?: string
}

type PaiementRecord = {
  id: string
  createdTime: string
  reference: string
  prospects: string[]
  fullName: string[]
  email: string[]
  amount: string
  currency: string
  purpose: string[]
  status: string
  dueDate: string
  paymentDate: string
  invoice: AirtableAttachment[]
  comment: string
  exemptionReason: string
  prospectId: string[]
  paymentMethod: string
  billingAddress: string
  proofOfPayment: AirtableAttachment[]
  lastModified: string
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => String(item)).filter(Boolean)
}

function asAttachmentArray(value: unknown): AirtableAttachment[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is AirtableAttachment => typeof item === "object" && item !== null)
    .map((item) => ({
      id: item.id,
      url: item.url,
      filename: item.filename,
    }))
}

function asString(value: unknown): string {
  if (value == null) return ""
  return String(value)
}

export async function GET() {
  const token = process.env.AIRTABLE_TOKEN
  const baseId =
    process.env.AIRTABLE_BASE_ID_PAIEMENTS ||
    process.env.AIRTABLE_BASE_ID_2 ||
    process.env.AIRTABLE_BASE_ID

  if (!token || !baseId) {
    return NextResponse.json(
      {
        error:
          "Airtable is not configured. Set AIRTABLE_TOKEN and one of AIRTABLE_BASE_ID_PAIEMENTS / AIRTABLE_BASE_ID_2 / AIRTABLE_BASE_ID in .env.local",
      },
      { status: 500 }
    )
  }

  try {
    const paiements: PaiementRecord[] = []
    let offset: string | undefined

    do {
      const url = new URL(`${AIRTABLE_API_URL}/${baseId}/${PAIEMENTS_TABLE_ID}`)
      url.searchParams.set("pageSize", "100")
      url.searchParams.set("returnFieldsByFieldId", "true")
      url.searchParams.set("sort[0][field]", FIELDS.lastModified)
      url.searchParams.set("sort[0][direction]", "desc")

      Object.values(FIELDS).forEach((fieldId) => {
        url.searchParams.append("fields[]", fieldId)
      })

      if (offset) url.searchParams.set("offset", offset)

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const airtableType = errorData?.error?.type ? String(errorData.error.type) : ""
        const airtableMessage = errorData?.error?.message

        if (response.status === 403 || airtableType === "INVALID_PERMISSIONS_OR_MODEL_NOT_FOUND") {
          return NextResponse.json(
            {
              error:
                "Airtable access denied for Paiements table (tblT2XDNBcvOfA4kj). Check token scopes and that the selected base contains this table.",
              details: airtableMessage || undefined,
              hint:
                "If Paiements is in another base, set AIRTABLE_BASE_ID_PAIEMENTS to the correct base id in .env.local.",
            },
            { status: 403 }
          )
        }

        return NextResponse.json(
          { error: airtableMessage || "Failed to fetch paiements from Airtable" },
          { status: response.status }
        )
      }

      const data = await response.json()
      const records = data.records || []

      for (const record of records) {
        const fields = (record.fields || {}) as Record<string, unknown>

        paiements.push({
          id: String(record.id),
          createdTime: asString(record.createdTime),
          reference: asString(fields[FIELDS.reference]),
          prospects: asStringArray(fields[FIELDS.prospects]),
          fullName: asStringArray(fields[FIELDS.fullName]),
          email: asStringArray(fields[FIELDS.email]),
          amount: asString(fields[FIELDS.amount]),
          currency: asString(fields[FIELDS.currency]),
          purpose: asStringArray(fields[FIELDS.purpose]),
          status: asString(fields[FIELDS.status]),
          dueDate: asString(fields[FIELDS.dueDate]),
          paymentDate: asString(fields[FIELDS.paymentDate]),
          invoice: asAttachmentArray(fields[FIELDS.invoice]),
          comment: asString(fields[FIELDS.comment]),
          exemptionReason: asString(fields[FIELDS.exemptionReason]),
          prospectId: asStringArray(fields[FIELDS.prospectId]),
          paymentMethod: asString(fields[FIELDS.paymentMethod]),
          billingAddress: asString(fields[FIELDS.billingAddress]),
          proofOfPayment: asAttachmentArray(fields[FIELDS.proofOfPayment]),
          lastModified: asString(fields[FIELDS.lastModified]),
        })
      }

      offset = data.offset
    } while (offset)

    return NextResponse.json({ paiements })
  } catch (error) {
    console.error("Fetch paiements failed:", error)
    return NextResponse.json({ error: "Failed to fetch paiements" }, { status: 500 })
  }
}
