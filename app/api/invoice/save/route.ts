import { NextRequest, NextResponse } from "next/server"
import type { PaymentMethodsSelection } from "@/lib/invoice-types"

const AIRTABLE_API_URL = "https://api.airtable.com/v0"

function formatPaymentMethods(paymentMethods: PaymentMethodsSelection): string {
  const methods: string[] = []
  if (paymentMethods.bankTransferItaly) methods.push("Bank Transfer (Italy)")
  if (paymentMethods.bankTransferTunisia) methods.push("Bank Transfer (Tunisia)")
  if (paymentMethods.other) methods.push("Other")
  return methods.join(", ") || "—"
}

export async function POST(request: NextRequest) {
  const token = process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID

  if (!token || !baseId) {
    return NextResponse.json(
      { error: "Airtable is not configured. Set AIRTABLE_TOKEN and AIRTABLE_BASE_ID in .env.local" },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const {
      date,
      dueDate,
      clientName,
      clientAddress,
      finalTotal,
      paymentMethods,
    } = body as {
      date: string
      dueDate: string
      clientName: string
      clientAddress: string
      finalTotal: number
      paymentMethods: PaymentMethodsSelection
    }

    const fields: Record<string, string | number> = {
      Date: date || "",
      "Due Date": dueDate || "",
      "Client Name": clientName || "",
      "Client Address": clientAddress || "",
      "Total to pay": finalTotal ?? 0,
      "Payment Method": formatPaymentMethods(paymentMethods || {}),
    }

    const response = await fetch(`${AIRTABLE_API_URL}/${baseId}/Invoices`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Airtable API error:", response.status, errorData)
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to save to Airtable" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({ success: true, recordId: data.id })
  } catch (error) {
    console.error("Save to Airtable failed:", error)
    return NextResponse.json(
      { error: "Failed to save invoice" },
      { status: 500 }
    )
  }
}
