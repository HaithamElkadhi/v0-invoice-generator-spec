"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Loader2, Paperclip, Send } from "lucide-react"
import { getPictureUrl, PICTURE_LABELS } from "@/lib/pictures"
import type { MailingModelRecord } from "@/lib/mailing-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const MAX_CHARS_PREVIEW = 220

function truncateMiddle(value: string, maxLength = 48): string {
  if (!value) return value
  if (value.length <= maxLength) return value
  const left = Math.ceil((maxLength - 1) / 2)
  const right = Math.floor((maxLength - 1) / 2)
  return `${value.slice(0, left)}…${value.slice(value.length - right)}`
}

function previewText(value: string, maxChars = MAX_CHARS_PREVIEW): string {
  const normalized = value.replace(/\s+/g, " ").trim()
  if (normalized.length <= maxChars) return normalized
  return `${normalized.slice(0, maxChars).trimEnd()}…`
}

function buildMailHtml(record: MailingModelRecord): string {
  const raw = (record.message || "").trim()
  const bodyHtml =
    raw.startsWith("<") ? raw : raw.split("\n").map((line) => `<p style="margin:0 0 12px;">${line || "<br>"}</p>`).join("")
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#111;">
  ${bodyHtml || "<p></p>"}
  <p style="margin:24px 0 0;">
    Best regards,<br/>
    Jeexpert
  </p>
</body>
</html>`.trim()
}

export default function MailingPage() {
  const [records, setRecords] = useState<MailingModelRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorHint, setErrorHint] = useState<string | null>(null)

  const [sendDialogOpen, setSendDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<MailingModelRecord | null>(null)
  const [fromKey, setFromKey] = useState<"default" | "contact" | "italy">("default")
  const [to, setTo] = useState("")
  const [cc, setCc] = useState("")
  const [bcc, setBcc] = useState("")
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [sendSuccess, setSendSuccess] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchModels() {
      try {
        const res = await fetch("/api/mailing/models")
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || "Failed to load models")
          setErrorHint(data.hint ?? null)
          return
        }
        setErrorHint(null)
        if (!cancelled) setRecords(data.records ?? [])
      } catch (e) {
        if (!cancelled) setError("Failed to load mailing models")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchModels()
    return () => {
      cancelled = true
    }
  }, [])

  const openSendDialog = (record: MailingModelRecord) => {
    setSelectedRecord(record)
    setFromKey("default")
    setTo("")
    setCc("")
    setBcc("")
    setSendError(null)
    setSendSuccess(null)
    setSendDialogOpen(true)
  }

  const parseEmails = (value: string): string[] =>
    value
      .split(/[\s,;]+/)
      .map((e) => e.trim())
      .filter(Boolean)

  const handleSend = async () => {
    if (!selectedRecord) return
    const toList = parseEmails(to)
    if (toList.length === 0) {
      setSendError("Enter at least one To address.")
      return
    }
    setSending(true)
    setSendError(null)
    setSendSuccess(null)
    try {
      const html = buildMailHtml(selectedRecord)
      const attachments =
        selectedRecord.attachments?.length > 0
          ? selectedRecord.attachments.map((att) => ({
              path: att.url,
              filename: att.filename || "attachment",
            }))
          : undefined
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromKey,
          to: toList,
          cc: parseEmails(cc),
          bcc: parseEmails(bcc),
          subject: selectedRecord.subject || "(No subject)",
          body: html,
          ...(attachments && { attachments }),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSendError(data.error || "Failed to send email")
        return
      }
      setSendSuccess("Email sent successfully.")
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setSendDialogOpen(false)
      setSelectedRecord(null)
    } catch (e) {
      setSendError("Failed to send email")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={getPictureUrl(PICTURE_LABELS.LogoApp)} alt="Jeexpert Logo" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-[rgb(41,84,144)]">Mailing</h1>
              <p className="text-sm text-muted-foreground">Send and manage emails</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/generator"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[rgb(41,84,144)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Generator
        </Link>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Email models</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Models loaded from Airtable table &quot;Support&quot; (same base as Invoices): Model Name, Subject, Message, Attachments
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Loading models…</span>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm">
            <p className="font-medium text-destructive">{error}</p>
            {errorHint && (
              <p className="mt-2 text-muted-foreground">{errorHint}</p>
            )}
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
            No email models found in Airtable. Add records to the &quot;Support&quot; table with
            Model Name, Subject, Message, and Attachments.
          </div>
        )}

        {!loading && !error && records.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {records.map((record) => (
              <article
                key={record.id}
                className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-full items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgb(41,84,144)]/10 text-[rgb(41,84,144)]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex flex-1 flex-col gap-3">
                    <h3 className="truncate text-base font-semibold text-foreground" title={record.modelName || "(No name)"}>
                      {record.modelName || "(No name)"}
                    </h3>
                    {record.subject && (
                      <p className="text-sm leading-6">
                        <span className="font-medium text-muted-foreground">Subject:</span>{" "}
                        <span className="break-words text-foreground">{record.subject}</span>
                      </p>
                    )}
                    {record.message && (
                      <p className="rounded-md border border-border/60 bg-muted/20 px-3 py-2 text-sm text-foreground" title={record.message}>
                        {previewText(record.message)}
                      </p>
                    )}
                    {record.attachments && record.attachments.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 rounded-md border border-border/60 bg-muted/20 px-3 py-2">
                        <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">
                          Attachments:
                        </span>
                        {record.attachments.map((att, i) => (
                          <a
                            key={i}
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block max-w-full truncate rounded bg-muted px-2 py-1 text-xs text-[rgb(41,84,144)] hover:underline"
                            title={att.filename || "Attachment"}
                          >
                            {truncateMiddle(att.filename || "Attachment")}
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[rgb(41,84,144)] text-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/10"
                        onClick={() => openSendDialog(record)}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
          <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Send email</DialogTitle>
              <DialogDescription>
                Preview the message and enter recipients. You can use commas or spaces to separate multiple addresses for To, CC, and BCC.
              </DialogDescription>
            </DialogHeader>
            {selectedRecord && (
              <>
                <div className="space-y-4 overflow-y-auto flex-1 min-h-0">
                  <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm space-y-1">
                    <p>
                      <span className="font-semibold text-muted-foreground">Subject: </span>
                      {selectedRecord.subject || "(No subject)"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Model: <span className="font-medium text-foreground">{selectedRecord.modelName || "(No name)"}</span>
                    </p>
                  </div>
                  <div className="rounded-md border border-border bg-muted/20 overflow-hidden">
                    <iframe
                      title="Email preview"
                      srcDoc={buildMailHtml(selectedRecord)}
                      className="w-full h-[280px] border-0 rounded-md"
                      sandbox="allow-same-origin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>From</Label>
                    <Select
                      value={fromKey}
                      onValueChange={(v) => setFromKey(v as "default" | "contact" | "italy")}
                      disabled={sending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select sender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Proposals (proposals@jeexpert-study.com)</SelectItem>
                        <SelectItem value="contact">Contact (contact@jeexpert-study.com)</SelectItem>
                        <SelectItem value="italy">Italy (italy@jeexpert-study.com)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mail-to">To (required)</Label>
                    <Input
                      id="mail-to"
                      type="text"
                      placeholder="email@example.com, other@example.com"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      disabled={sending}
                    />
                    {to.trim().length > 0 && (
                      <p className="text-xs text-muted-foreground" title={to}>
                        Recipient preview: {truncateMiddle(to.trim(), 70)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mail-cc">CC</Label>
                    <Input
                      id="mail-cc"
                      type="text"
                      placeholder="cc@example.com"
                      value={cc}
                      onChange={(e) => setCc(e.target.value)}
                      disabled={sending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mail-bcc">BCC</Label>
                    <Input
                      id="mail-bcc"
                      type="text"
                      placeholder="bcc@example.com"
                      value={bcc}
                      onChange={(e) => setBcc(e.target.value)}
                      disabled={sending}
                    />
                  </div>
                  {sendError && (
                    <p className="text-sm text-destructive">{sendError}</p>
                  )}
                </div>
                <DialogFooter className="shrink-0 border-t pt-4">
                  {sendSuccess && (
                    <p className="mr-auto text-sm font-medium text-emerald-600" role="status" aria-live="polite">
                      {sendSuccess}
                    </p>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSendDialogOpen(false)}
                    disabled={sending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSend}
                    disabled={sending}
                    className="bg-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/90"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      "Send email"
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
