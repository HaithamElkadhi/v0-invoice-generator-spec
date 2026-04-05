export interface WhatsAppModelRecord {
  id: string
  modelName: string
  message: string
  attachments: { url: string; filename?: string }[]
}

export type WhatsAppAttachment = { url: string; filename?: string }

/**
 * WhatsApp wa.me only supports a text parameter — files cannot be attached via URL.
 * Builds the final plain text sent to WhatsApp: body + titled lines + full URLs (WhatsApp will linkify URLs).
 */
export function buildWhatsAppPayloadForSend(
  messageBody: string,
  attachments: WhatsAppAttachment[]
): string {
  const body = (messageBody || "").trim()
  const atts = (attachments ?? []).filter((a) => a.url?.trim())
  if (!atts.length) return body

  const parts = atts.map((a) => {
    const name = a.filename?.trim() || "Attachment"
    return `${name}\n${a.url.trim()}`
  })
  const attBlock = parts.join("\n\n")
  if (!body) return attBlock
  return `${body}\n\n${attBlock}`
}
