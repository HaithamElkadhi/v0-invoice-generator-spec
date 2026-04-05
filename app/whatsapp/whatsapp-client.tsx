"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ArrowLeft, Loader2, Paperclip } from "lucide-react"
import { WhatsAppComposer } from "@/components/whatsapp-composer"
import { Button } from "@/components/ui/button"
import { getPictureUrl, PICTURE_LABELS } from "@/lib/pictures"
import type { WhatsAppAttachment, WhatsAppModelRecord } from "@/lib/whatsapp-types"

function normalizeAttachments(rec: WhatsAppModelRecord): WhatsAppAttachment[] {
  return (rec.attachments ?? []).filter((a) => a.url?.trim())
}

export function WhatsAppClient() {
  const searchParams = useSearchParams()
  const phoneParam = searchParams.get("phone")
  const messageParam = searchParams.get("message")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [templateId, setTemplateId] = useState("__none__")
  const [templateAttachments, setTemplateAttachments] = useState<WhatsAppAttachment[]>([])
  const [phoneTouched, setPhoneTouched] = useState(false)

  const [records, setRecords] = useState<WhatsAppModelRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorHint, setErrorHint] = useState<string | null>(null)

  useEffect(() => {
    setPhone(phoneParam ?? "")
    setMessage(messageParam ?? "")
    setTemplateId("__none__")
    setTemplateAttachments([])
    setPhoneTouched(false)
  }, [phoneParam, messageParam])

  useEffect(() => {
    let cancelled = false
    async function fetchModels() {
      setLoading(true)
      setError(null)
      setErrorHint(null)
      try {
        const res = await fetch("/api/whatsapp/models")
        const data = await res.json()
        if (!res.ok) {
          if (!cancelled) {
            setError(data.error || "Failed to load WhatsApp models")
            setErrorHint(data.hint ?? null)
            setRecords([])
          }
          return
        }
        if (!cancelled) {
          setRecords(data.records ?? [])
          setErrorHint(null)
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load WhatsApp models")
          setRecords([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchModels()
    return () => {
      cancelled = true
    }
  }, [])

  const templateSelectItems = useMemo(() => {
    const items = [{ id: "__none__", label: "No template" }]
    for (const r of records) {
      items.push({
        id: r.id,
        label: r.modelName.trim() || "Untitled model",
      })
    }
    return items
  }, [records])

  const recordById = useMemo(() => {
    const m = new Map<string, WhatsAppModelRecord>()
    for (const r of records) m.set(r.id, r)
    return m
  }, [records])

  const applyRecord = useCallback((rec: WhatsAppModelRecord) => {
    setMessage((rec.message || "").trim())
    setTemplateAttachments(normalizeAttachments(rec))
  }, [])

  const handleTemplateChange = useCallback(
    (id: string) => {
      setTemplateId(id)
      if (id === "__none__") {
        setMessage("")
        setTemplateAttachments([])
        return
      }
      const rec = recordById.get(id)
      if (rec) applyRecord(rec)
    },
    [recordById, applyRecord]
  )

  const applyTemplateFromGallery = useCallback(
    (rec: WhatsAppModelRecord) => {
      setTemplateId(rec.id)
      applyRecord(rec)
    },
    [applyRecord]
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="shrink-0">
              <Link href="/" aria-label="Back to modules">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <img
              src={getPictureUrl(PICTURE_LABELS.LogoApp)}
              alt=""
              className="h-10 w-10"
            />
            <div>
              <h1 className="text-xl font-bold text-[rgb(41,84,144)]">WhatsApp</h1>
              <p className="text-sm text-muted-foreground">
                Templates from Airtable (Italy wsp) — compose your WhatsApp link
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:items-start">
          <section className="min-w-0 space-y-4">
            <h2 className="text-lg font-semibold text-[rgb(41,84,144)]">
              Message templates
            </h2>
            <p className="text-sm text-muted-foreground">
              Models come from the <strong className="text-foreground">Italy wsp</strong> table (same base as Mailing). Click{" "}
              <strong className="text-foreground">Use template</strong> to load the message into the composer. Attachments show
              as named links; full URLs are added when you send to WhatsApp.
            </p>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading templates from Airtable…
              </div>
            )}

            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                <p>{error}</p>
                {errorHint && <p className="mt-1 text-xs opacity-90">{errorHint}</p>}
              </div>
            )}

            {!loading && !error && records.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No rows in <strong className="text-foreground">Italy wsp</strong>. Add records with Model name, Message, and optional Attachments.
              </p>
            )}

            {!loading && records.length > 0 && (
              <ul className="min-w-0 space-y-3">
                {records.map((rec) => (
                  <li
                    key={rec.id}
                    className="min-w-0 rounded-lg border border-border bg-card p-4 shadow-sm"
                  >
                    <p className="break-words font-medium text-foreground">
                      {rec.modelName || "Untitled model"}
                    </p>
                    <div className="mt-2 max-h-48 min-w-0 overflow-x-hidden overflow-y-auto rounded-md bg-muted/30 p-3">
                      <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground [overflow-wrap:anywhere]">
                        {(rec.message || "").trim() || "—"}
                      </p>
                    </div>
                    {normalizeAttachments(rec).length > 0 && (
                      <ul className="mt-2 min-w-0 space-y-1.5 text-sm">
                        {normalizeAttachments(rec).map((a, i) => (
                          <li key={`${rec.id}-att-${i}`} className="min-w-0">
                            <a
                              href={a.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex max-w-full items-start gap-1.5 break-words text-[rgb(41,84,144)] underline-offset-2 hover:underline"
                            >
                              <Paperclip className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                              <span className="min-w-0">{a.filename?.trim() || "Attachment"}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3 border-[#25D366]/40 text-[#128C7E] hover:bg-[#25D366]/10"
                      onClick={() => applyTemplateFromGallery(rec)}
                    >
                      Use template
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <WhatsAppComposer
            phone={phone}
            message={message}
            templateId={templateId}
            templateAttachments={templateAttachments}
            templateSelectItems={templateSelectItems}
            onPhoneChange={setPhone}
            onMessageChange={setMessage}
            onTemplateChange={handleTemplateChange}
            phoneTouched={phoneTouched}
            onPhoneBlur={() => setPhoneTouched(true)}
          />
        </div>
      </main>
    </div>
  )
}
