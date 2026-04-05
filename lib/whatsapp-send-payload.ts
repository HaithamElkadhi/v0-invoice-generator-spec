import type { WhatsAppAttachment } from "@/lib/whatsapp-types"

async function shortenUrlClient(longUrl: string): Promise<string> {
  try {
    const res = await fetch("/api/shorten-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: longUrl }),
    })
    const data = (await res.json()) as { shortUrl?: string; error?: string }
    if (res.ok && data.shortUrl?.startsWith("http")) return data.shortUrl
  } catch {
    /* use long URL */
  }
  return longUrl
}

/**
 * Builds WhatsApp text: message body + for each attachment a title line and a short (or fallback long) URL.
 */
export async function buildWhatsAppPayloadWithShortLinks(
  messageBody: string,
  attachments: WhatsAppAttachment[]
): Promise<string> {
  const body = (messageBody || "").trim()
  const atts = (attachments ?? []).filter((a) => a.url?.trim())
  if (!atts.length) return body

  const parts: string[] = []
  for (const a of atts) {
    const name = a.filename?.trim() || "Attachment"
    const longUrl = a.url.trim()
    const link = await shortenUrlClient(longUrl)
    parts.push(`${name}\n${link}`)
  }
  const attBlock = parts.join("\n\n")
  if (!body) return attBlock
  return `${body}\n\n${attBlock}`
}
