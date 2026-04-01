import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

function parseEmails(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((v) =>
      String(v)
        .split(/[\s,;]+/)
        .map((e) => e.trim())
        .filter(Boolean)
    )
  }
  if (typeof value === "string") {
    return value
      .split(/[\s,;]+/)
      .map((e) => e.trim())
      .filter(Boolean)
  }
  return []
}

function buildHtml(rawBody: string): string {
  const trimmed = (rawBody || "").trim()
  if (!trimmed) return "<p></p>"
  if (trimmed.startsWith("<")) return trimmed
  return trimmed
    .split("\n")
    .map((line: string) => `<p>${line || "<br>"}</p>`)
    .join("")
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "Resend is not configured. Set RESEND_API_KEY in .env.local" },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const defaultFrom = process.env.RESEND_FROM ?? "onboarding@resend.dev"

    // Mailing flow: to (array or comma-separated), optional cc, bcc, subject, body, attachments, fromKey
    const toList = parseEmails(body.to)
    if (toList.length > 0) {
      const fromKey = (body.fromKey as string) || "default"
      const fromMap: Record<string, string | undefined> = {
        default: process.env.RESEND_FROM,
        contact: process.env.RESEND_FROM_CONTACT,
        italy: process.env.RESEND_FROM_ITALY,
      }
      const from = fromMap[fromKey] || defaultFrom

      const ccList = parseEmails(body.cc)
      const bccList = parseEmails(body.bcc)
      const subject = (body.subject ?? "").trim() || "(No subject)"
      const html = buildHtml(body.body ?? "")
      const rawAttachments = body.attachments as { path: string; filename?: string }[] | undefined
      const attachments =
        Array.isArray(rawAttachments) && rawAttachments.length > 0
          ? rawAttachments
              .filter((a) => a && typeof a.path === "string" && a.path.trim())
              .map((a) => ({
                filename: (a.filename || "attachment").trim() || "attachment",
                path: a.path.trim(),
              }))
          : undefined

      const { data, error } = await resend.emails.send({
        from,
        to: toList,
        cc: ccList.length > 0 ? ccList : undefined,
        bcc: bccList.length > 0 ? bccList : undefined,
        subject,
        html,
        attachments,
      })

      if (error) {
        console.error("Resend error:", error)
        return NextResponse.json(
          { error: error.message || "Failed to send email" },
          { status: 400 }
        )
      }
      return NextResponse.json({ success: true, id: data?.id })
    }

    // Proposal flow: toName, toEmail, optional cc, subject, body (single recipient)
    const { toName, toEmail, cc, subject, body: emailBody } = body as {
      toName?: string
      toEmail?: string
      cc?: string | string[]
      subject?: string
      body?: string
    }

    if (!toName?.trim() || !toEmail?.trim()) {
      return NextResponse.json(
        { error: "Full name and email are required" },
        { status: 400 }
      )
    }

    const html = buildHtml(emailBody ?? "")

    const ccList = parseEmails(cc)

    const { data, error } = await resend.emails.send({
      from: defaultFrom,
      to: toEmail.trim(),
      cc: ccList.length > 0 ? ccList : undefined,
      subject: subject || "(No subject)",
      html: html || "<p></p>",
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        { error: error.message || "Failed to send email" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("Send email failed:", error)
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    )
  }
}
