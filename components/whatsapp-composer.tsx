"use client"

import { useState } from "react"
import { Loader2, MessageCircle, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { buildWhatsAppPayloadForSend, type WhatsAppAttachment } from "@/lib/whatsapp-types"
import { buildWhatsAppPayloadWithShortLinks } from "@/lib/whatsapp-send-payload"
import { phoneToDigits } from "@/lib/whatsapp-templates"

export interface WhatsAppComposerProps {
  phone: string
  message: string
  templateId: string
  /** Files from the selected Airtable template — shown as titled links; URLs are appended on send only */
  templateAttachments: WhatsAppAttachment[]
  templateSelectItems: { id: string; label: string }[]
  onPhoneChange: (value: string) => void
  onMessageChange: (value: string) => void
  onTemplateChange: (id: string) => void
  phoneTouched: boolean
  onPhoneBlur: () => void
}

export function WhatsAppComposer({
  phone,
  message,
  templateId,
  templateAttachments,
  templateSelectItems,
  onPhoneChange,
  onMessageChange,
  onTemplateChange,
  phoneTouched,
  onPhoneBlur,
}: WhatsAppComposerProps) {
  const [sending, setSending] = useState(false)

  const phoneDigits = phoneToDigits(phone)
  const phoneValid = phoneDigits.length >= 9
  const payloadPreview = buildWhatsAppPayloadForSend(message, templateAttachments)
  const messageValid = payloadPreview.trim().length > 0

  const handleSend = async () => {
    if (!phoneValid || !messageValid || sending) return
    setSending(true)
    try {
      const payload = await buildWhatsAppPayloadWithShortLinks(message, templateAttachments)
      const digits = phoneToDigits(phone)
      const url = `https://wa.me/${digits}?text=${encodeURIComponent(payload.trim())}`
      window.open(url, "_blank", "noopener,noreferrer")
    } catch (e) {
      console.error(e)
      alert("Could not prepare the message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[rgb(41,84,144)]">
        <MessageCircle className="h-5 w-5 text-[#25D366]" />
        Compose message
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Attachment links are shortened automatically so WhatsApp shows a small clickable link instead of a long Airtable URL.
        WhatsApp cannot hide a URL behind custom text — only short links keep the chat readable.
      </p>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="whatsapp-phone">
            Phone number <span className="text-[rgb(220,53,69)]">*</span>
          </Label>
          <Input
            id="whatsapp-phone"
            type="tel"
            placeholder="+393123456789"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            onBlur={onPhoneBlur}
            aria-invalid={phoneTouched && !phoneValid}
          />
          {phoneTouched && !phoneValid && phone.length > 0 && (
            <p className="text-xs text-destructive">
              Enter a valid number with country code (e.g. +39 312 345 6789)
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Spaces, dashes and symbols are removed automatically. Only digits are sent to WhatsApp.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp-template">Template (optional)</Label>
          <Select value={templateId} onValueChange={onTemplateChange}>
            <SelectTrigger id="whatsapp-template" className="w-full">
              <SelectValue placeholder="Choose a template..." />
            </SelectTrigger>
            <SelectContent>
              {templateSelectItems.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp-message">
            Message <span className="text-[rgb(220,53,69)]">*</span>
          </Label>
          <Textarea
            id="whatsapp-message"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            rows={6}
            className="min-h-[120px] max-w-full break-words [overflow-wrap:anywhere]"
          />
          {templateAttachments.length > 0 && (
            <div className="rounded-md border border-border bg-muted/40 p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Attachments (added when sending)</p>
              <ul className="space-y-2">
                {templateAttachments.map((a, i) => {
                  const label = a.filename?.trim() || "Attachment"
                  const href = a.url?.trim() || "#"
                  return (
                    <li key={`att-${i}`}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-full items-start gap-2 break-words text-sm font-medium text-[rgb(41,84,144)] underline-offset-2 hover:underline"
                      >
                        <Paperclip className="mt-0.5 h-4 w-4 shrink-0" />
                        <span className="min-w-0">{label}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
        <Button
          type="button"
          onClick={() => void handleSend()}
          disabled={!phoneValid || !messageValid || sending}
          className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white sm:w-auto"
        >
          {sending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing links…
            </>
          ) : (
            "Send via WhatsApp"
          )}
        </Button>
      </div>
    </div>
  )
}
