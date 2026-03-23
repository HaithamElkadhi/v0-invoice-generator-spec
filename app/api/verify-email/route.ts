import { NextRequest, NextResponse } from "next/server"

/**
 * Email verification API – checks if an email exists / is deliverable.
 * Uses Abstract API: https://www.abstractapi.com/api/email-verification-validation-api
 * Free tier: 100 requests/month. Set ABSTRACT_EMAIL_API_KEY in .env.local
 */

const ABSTRACT_API_BASE = "https://emailvalidation.abstractapi.com/v1"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body?.email === "string" ? body.email.trim() : ""

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 }
      )
    }

    const apiKey = process.env.ABSTRACT_EMAIL_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          ok: false,
          error: "Email validation not configured. Add ABSTRACT_EMAIL_API_KEY to .env.local",
        },
        { status: 503 }
      )
    }

    const url = new URL(ABSTRACT_API_BASE)
    url.searchParams.set("api_key", apiKey)
    url.searchParams.set("email", email)

    const res = await fetch(url.toString(), { next: { revalidate: 0 } })
    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data.message || "Verification failed" },
        { status: res.status }
      )
    }

    const deliverability = (data.deliverability ?? data.email_deliverability?.status ?? "").toUpperCase()
    const isValidFormat = data.is_valid_format ?? data.email_deliverability?.is_format_valid ?? false
    const isMxFound = data.is_mx_found ?? data.email_deliverability?.is_mx_valid ?? false
    const isSmtpValid = data.is_smtp_valid ?? data.email_deliverability?.is_smtp_valid ?? false

    const exists =
      (deliverability === "DELIVERABLE" || deliverability === "deliverable") &&
      (isValidFormat && (isMxFound || isSmtpValid))

    return NextResponse.json({
      ok: true,
      email,
      exists,
      deliverability: deliverability || "UNKNOWN",
      is_valid_format: isValidFormat,
      is_mx_found: isMxFound,
      is_smtp_valid: isSmtpValid,
      is_disposable: data.is_disposable_email ?? data.email_quality?.is_disposable ?? false,
    })
  } catch (err) {
    console.error("[verify-email]", err)
    return NextResponse.json(
      { ok: false, error: "Verification error" },
      { status: 500 }
    )
  }
}
