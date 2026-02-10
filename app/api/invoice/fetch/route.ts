import { NextResponse } from "next/server"

const AIRTABLE_API_URL = "https://api.airtable.com/v0"

export async function GET() {
  const token = process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID

  if (!token || !baseId) {
    return NextResponse.json(
      { error: "Airtable is not configured. Set AIRTABLE_TOKEN and AIRTABLE_BASE_ID in .env.local" },
      { status: 500 }
    )
  }

  try {
    const invoiceNumbers: string[] = []
    let offset: string | undefined

    do {
      const url = new URL(`${AIRTABLE_API_URL}/${baseId}/Invoices`)
      url.searchParams.set("pageSize", "100")
      if (offset) url.searchParams.set("offset", offset)

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return NextResponse.json(
          { error: errorData.error?.message || "Failed to fetch from Airtable" },
          { status: response.status }
        )
      }

      const data = await response.json()
      const records = data.records || []

      for (const record of records) {
        const fields = record.fields || {}
        let num =
          fields["Invoice Number"] ??
          fields["InvoiceNumber"] ??
          fields["Invoice #"] ??
          fields["invoice_number"] ??
          fields["Invoice"]
        if (num == null) {
          const invoiceKey = Object.keys(fields).find(
            (k) => k.toLowerCase().includes("invoice")
          )
          if (invoiceKey) num = fields[invoiceKey]
        }
        if (num != null && String(num).trim()) {
          invoiceNumbers.push(String(num).trim())
        }
      }

      offset = data.offset
    } while (offset)

    const unique = [...new Set(invoiceNumbers)].sort()
    return NextResponse.json({ invoiceNumbers: unique })
  } catch (error) {
    console.error("Fetch invoices failed:", error)
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    )
  }
}
