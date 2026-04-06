"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Loader2, Mail, Send } from "lucide-react"
import { BilingualRow } from "./knowledge-hub-shared"
import {
  MASTER_DOCUMENTS_CHECKLIST_STORAGE_KEY,
  MASTER_DOCUMENTS_ITALIAN_STORAGE_KEY,
  MASTER_DOCS_MAIL_INCLUDE_LEGALISATION_KEY,
  MASTER_DOCS_MAIL_INCLUDE_PROCESS_KEY,
  MASTER_DOCUMENTS_SECTIONS,
  collectAllItemIds,
  type MasterDocItem,
} from "./master-documents-checklist-data"
import {
  LEGALISATION_DIPLOME_BLOCKS,
  LEGALISATION_PROCESS_GOLDEN_RULE_FR,
  LEGALISATION_PROCESS_STEPS,
} from "./legalisation-reference-data"
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

const DEFAULT_MAIL_SUBJECT = "Jeexpert — Récapitulatif de votre dossier (études en Italie)"

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function buildLegalisationProcessHtml(): string {
  let h = `<h3 style="margin:0 0 8px;font-size:15px;color:#1a1a1a;">Les étapes à respecter</h3>`
  h += `<p dir="rtl" style="margin:0 0 12px;font-size:13px;color:#555;">الخطوات بالترتيب الصحيح</p>`
  h += `<ol style="margin:0 0 12px;padding-left:22px;">`
  LEGALISATION_PROCESS_STEPS.forEach((step) => {
    h += `<li style="margin:10px 0;">${escapeHtml(step.fr)}`
    h += `<br/><span dir="rtl" style="display:block;margin-top:4px;color:#333;">${escapeHtml(step.ar)}</span></li>`
  })
  h += `</ol>`
  h += `<p style="margin:0;padding:10px;border:1px solid #e5e7eb;background:#fafafa;font-size:12px;">${escapeHtml(LEGALISATION_PROCESS_GOLDEN_RULE_FR)}</p>`
  return h
}

function buildLegalisationDiplomeHtml(): string {
  let h = `<h3 style="margin:0 0 8px;font-size:15px;color:#1a1a1a;">Où légaliser selon votre diplôme</h3>`
  h += `<p dir="rtl" style="margin:0 0 12px;font-size:13px;color:#555;">أين تتم المصادقة حسب نوع الشهادة</p>`
  LEGALISATION_DIPLOME_BLOCKS.forEach((block) => {
    h += `<div style="margin:10px 0;padding:10px;border:1px solid #e5e7eb;background:#fafafa;">`
    h += `<p style="margin:0 0 4px;font-weight:bold;">${escapeHtml(block.frTitle)}</p>`
    h += `<p dir="rtl" style="margin:0 0 6px;font-size:13px;">${escapeHtml(block.arTitle)}</p>`
    h += `<p style="margin:0;font-size:13px;color:#166534;">${escapeHtml(block.frMin)}</p>`
    h += `<p dir="rtl" style="margin:4px 0 0;font-size:13px;color:#166534;">${escapeHtml(block.arMin)}</p>`
    if (block.note) {
      h += `<p style="margin:8px 0 0;padding-top:8px;border-top:1px solid #eee;font-size:12px;font-style:italic;">${escapeHtml(block.note)}</p>`
    }
    h += `</div>`
  })
  return h
}

function buildChecklistEmailHtml(
  checked: Record<string, boolean>,
  italianRequired: Record<string, boolean>,
  includeProcess: boolean,
  includeLegalisation: boolean
): string {
  const wrap = `font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:1.55;color:#222;`
  let inner = `<div style="${wrap}max-width:640px;">`

  inner += `<p style="margin:0 0 16px;">Bonjour,</p>`

  let anyDocs = false
  for (const sec of MASTER_DOCUMENTS_SECTIONS) {
    const n = sec.items.filter((i) => checked[i.id]).length
    if (n > 0) anyDocs = true
  }

  if (anyDocs && (includeProcess || includeLegalisation)) {
    inner += `<p style="margin:0 0 20px;">Vous trouverez ci-dessous la liste des pièces pour votre projet d&apos;études en Italie (master), puis en complément la procédure de légalisation en Tunisie. La colonne « Italien » indique si la pièce doit être fournie en italien (traduction ou version conforme au dossier).</p>`
  } else if (anyDocs) {
    inner += `<p style="margin:0 0 20px;">Voici le récapitulatif des pièces concernant votre projet d&apos;études en Italie (master). La colonne « Italien » précise si la pièce doit être fournie en italien (traduction ou version conforme au dossier).</p>`
  } else if (includeProcess || includeLegalisation) {
    inner += `<p style="margin:0 0 20px;">Voici des informations pratiques sur les démarches de légalisation en Tunisie : ordre des étapes et administration compétente selon votre diplôme.</p>`
  }

  let firstTable = true
  for (const sec of MASTER_DOCUMENTS_SECTIONS) {
    const items = sec.items.filter((i) => checked[i.id])
    if (items.length === 0) continue
    if (firstTable) {
      inner += `<h2 style="margin:0 0 14px;font-size:16px;font-weight:600;color:#111;">Documents à prévoir</h2>`
      firstTable = false
    }
    inner += `<h3 style="margin:18px 0 8px;font-size:14px;font-weight:600;color:#333;">${escapeHtml(sec.titleFr)}</h3>`
    inner += `<p dir="rtl" style="margin:0 0 8px;font-size:12px;color:#666;">${escapeHtml(sec.titleAr)}</p>`
    inner += `<table style="width:100%;border-collapse:collapse;margin-bottom:8px;" cellpadding="0" cellspacing="0">`
    inner += `<tr style="background:#f8f9fa;"><th style="padding:8px;border:1px solid #e2e8f0;text-align:left;font-size:12px;font-weight:600;">Détail</th><th style="padding:8px;border:1px solid #e2e8f0;text-align:right;font-size:12px;font-weight:600;" dir="rtl">التفاصيل</th><th style="padding:8px;border:1px solid #e2e8f0;text-align:center;font-size:11px;font-weight:600;width:80px;">Italien</th></tr>`
    for (const item of items) {
      const it = italianRequired[item.id]
      const itCell = it ? `Oui` : `Non`
      inner += `<tr><td style="padding:8px;border:1px solid #e2e8f0;vertical-align:top;">${escapeHtml(item.fr)}</td>`
      inner += `<td dir="rtl" style="padding:8px;border:1px solid #e2e8f0;vertical-align:top;text-align:right;">${escapeHtml(item.ar)}</td>`
      inner += `<td style="padding:8px;border:1px solid #e2e8f0;vertical-align:middle;text-align:center;font-size:13px;">${itCell}</td></tr>`
    }
    inner += `</table>`
  }

  if (includeProcess || includeLegalisation) {
    inner += `<h2 style="margin:28px 0 12px;font-size:16px;font-weight:600;color:#111;border-top:1px solid #e2e8f0;padding-top:20px;">Complément — démarches en Tunisie</h2>`
    inner += `<p style="margin:0 0 16px;font-size:13px;color:#666;">Ces éléments vous aident à enchaîner correctement légalisation administrative et Apostille avant tout envoi au consulat ou à l&apos;université.</p>`
    if (includeProcess) inner += buildLegalisationProcessHtml()
    if (includeLegalisation) {
      inner += `<div style="margin-top:${includeProcess ? "20px" : "0"}">`
      inner += buildLegalisationDiplomeHtml()
      inner += `</div>`
    }
  }

  inner += `<p style="margin:28px 0 0;">Nous restons à votre disposition pour toute précision.</p>`
  inner += `<p style="margin:16px 0 0;">Cordialement,<br/><strong>Jeexpert</strong></p>`
  inner += `</div>`
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:24px;background:#fafafa;">${inner}</body></html>`
}

function loadChecked(): Record<string, boolean> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(MASTER_DOCUMENTS_CHECKLIST_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, boolean>
    return typeof parsed === "object" && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function saveChecked(next: Record<string, boolean>) {
  try {
    localStorage.setItem(MASTER_DOCUMENTS_CHECKLIST_STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* ignore quota */
  }
}

function loadItalian(): Record<string, boolean> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(MASTER_DOCUMENTS_ITALIAN_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, boolean>
    return typeof parsed === "object" && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function saveItalian(next: Record<string, boolean>) {
  try {
    localStorage.setItem(MASTER_DOCUMENTS_ITALIAN_STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
}

function loadMailInclude(key: string): boolean {
  if (typeof window === "undefined") return false
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return false
    return JSON.parse(raw) === true
  } catch {
    return false
  }
}

function saveMailInclude(key: string, value: boolean) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

function parseEmails(value: string): string[] {
  return value
    .split(/[\s,;]+/)
    .map((e) => e.trim())
    .filter(Boolean)
}

function truncateMiddle(value: string, maxLength = 48): string {
  if (!value) return value
  if (value.length <= maxLength) return value
  const left = Math.ceil((maxLength - 1) / 2)
  const right = Math.floor((maxLength - 1) / 2)
  return `${value.slice(0, left)}…${value.slice(value.length - right)}`
}

function CheckRow({
  item,
  checked,
  italianRequired,
  onToggle,
  onToggleItalian,
}: {
  item: MasterDocItem
  checked: boolean
  italianRequired: boolean
  onToggle: () => void
  onToggleItalian: () => void
}) {
  return (
    <li className="border-b border-border last:border-0">
      <div className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-start sm:gap-4 sm:px-4">
        <div className="flex shrink-0 items-center gap-5 sm:pt-0.5">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={italianRequired}
              onChange={onToggleItalian}
              className="size-4 rounded border border-input accent-foreground"
              aria-label={`Italien — ${item.fr}`}
            />
            <span>IT</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={checked}
              onChange={onToggle}
              className="size-4 rounded border border-input accent-foreground"
              aria-label={`Liste — ${item.fr}`}
            />
            <span>Liste</span>
          </label>
        </div>
        <div className="min-w-0 flex-1">
          <BilingualRow
            fr={
              <span
                className={`text-sm leading-relaxed ${checked ? "text-muted-foreground line-through" : "text-foreground"}`}
              >
                {item.fr}
              </span>
            }
            ar={
              <span
                className={`text-sm leading-relaxed ${checked ? "text-muted-foreground line-through" : "text-foreground"}`}
              >
                {item.ar}
              </span>
            }
          />
        </div>
      </div>
    </li>
  )
}

export function MasterDocumentsChecklist() {
  const allIds = useMemo(() => collectAllItemIds(), [])
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [italianRequired, setItalianRequired] = useState<Record<string, boolean>>({})
  const [includeProcess, setIncludeProcess] = useState(false)
  const [includeLegalisation, setIncludeLegalisation] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const [sendOpen, setSendOpen] = useState(false)
  const [fromKey, setFromKey] = useState<"default" | "contact" | "italy">("default")
  const [to, setTo] = useState("")
  const [cc, setCc] = useState("")
  const [bcc, setBcc] = useState("")
  const [subject, setSubject] = useState(DEFAULT_MAIL_SUBJECT)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [sendSuccess, setSendSuccess] = useState<string | null>(null)

  useEffect(() => {
    setChecked(loadChecked())
    setItalianRequired(loadItalian())
    setIncludeProcess(loadMailInclude(MASTER_DOCS_MAIL_INCLUDE_PROCESS_KEY))
    setIncludeLegalisation(loadMailInclude(MASTER_DOCS_MAIL_INCLUDE_LEGALISATION_KEY))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveChecked(checked)
  }, [checked, hydrated])

  useEffect(() => {
    if (!hydrated) return
    saveItalian(italianRequired)
  }, [italianRequired, hydrated])

  useEffect(() => {
    if (!hydrated) return
    saveMailInclude(MASTER_DOCS_MAIL_INCLUDE_PROCESS_KEY, includeProcess)
  }, [includeProcess, hydrated])

  useEffect(() => {
    if (!hydrated) return
    saveMailInclude(MASTER_DOCS_MAIL_INCLUDE_LEGALISATION_KEY, includeLegalisation)
  }, [includeLegalisation, hydrated])

  const toggle = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const toggleItalian = useCallback((id: string) => {
    setItalianRequired((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const doneCount = useMemo(() => allIds.filter((id) => checked[id]).length, [allIds, checked])

  const resetAll = useCallback(() => {
    setChecked({})
    setItalianRequired({})
    setIncludeProcess(false)
    setIncludeLegalisation(false)
    saveChecked({})
    saveItalian({})
    saveMailInclude(MASTER_DOCS_MAIL_INCLUDE_PROCESS_KEY, false)
    saveMailInclude(MASTER_DOCS_MAIL_INCLUDE_LEGALISATION_KEY, false)
  }, [])

  const openSendDialog = useCallback(() => {
    setSubject(DEFAULT_MAIL_SUBJECT)
    setTo("")
    setCc("")
    setBcc("")
    setFromKey("default")
    setSendError(null)
    setSendSuccess(null)
    setSendOpen(true)
  }, [])

  const handleSend = async () => {
    const toList = parseEmails(to)
    if (toList.length === 0) {
      setSendError("Indiquez au moins une adresse « À ».")
      return
    }
    if (doneCount === 0 && !includeProcess && !includeLegalisation) {
      setSendError("Cochez au moins un document (Liste) ou un bloc légalisation ci-dessus.")
      return
    }
    setSending(true)
    setSendError(null)
    setSendSuccess(null)
    try {
      const html = buildChecklistEmailHtml(checked, italianRequired, includeProcess, includeLegalisation)
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromKey,
          to: toList,
          cc: parseEmails(cc),
          bcc: parseEmails(bcc),
          subject: subject.trim() || DEFAULT_MAIL_SUBJECT,
          body: html,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSendError(data.error || "Échec de l’envoi")
        return
      }
      setSendSuccess("E-mail envoyé.")
      await new Promise((r) => setTimeout(r, 1000))
      setSendOpen(false)
    } catch {
      setSendError("Échec de l’envoi")
    } finally {
      setSending(false)
    }
  }

  const previewHtml = useMemo(
    () => buildChecklistEmailHtml(checked, italianRequired, includeProcess, includeLegalisation),
    [checked, italianRequired, includeProcess, includeLegalisation]
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-muted-foreground">
          Liste :{" "}
          <span className="font-medium text-foreground">
            {doneCount}/{allIds.length}
          </span>
          {hydrated ? <span className="text-muted-foreground"> · mémorisé localement</span> : null}
          <span className="text-muted-foreground"> · IT = italien · Liste = e-mail</span>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {doneCount > 0 || includeProcess || includeLegalisation ? (
            <Button type="button" size="sm" variant="secondary" onClick={openSendDialog}>
              <Mail className="mr-2 h-4 w-4" aria-hidden />
              Envoyer par mail
            </Button>
          ) : null}
          <Button type="button" size="sm" variant="ghost" className="text-muted-foreground" onClick={resetAll}>
            Tout décocher
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/15 px-4 py-3 text-sm">
        <p className="mb-2 text-xs font-medium text-muted-foreground">À inclure dans l&apos;e-mail (réf. Legalisation Tunis)</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={includeProcess}
              onChange={() => setIncludeProcess((v) => !v)}
              className="size-4 rounded border border-input accent-foreground"
            />
            <span>Processus global (ordre à respecter)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={includeLegalisation}
              onChange={() => setIncludeLegalisation((v) => !v)}
              className="size-4 rounded border border-input accent-foreground"
            />
            <span>Légalisation préalable selon le type de diplôme</span>
          </label>
        </div>
      </div>

      {MASTER_DOCUMENTS_SECTIONS.map((section) => (
        <section key={section.id} className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="border-b border-border bg-muted/40 px-4 py-2.5">
            <h2 className="text-sm font-semibold text-foreground">{section.titleFr}</h2>
            <p dir="rtl" lang="ar" className="mt-0.5 text-xs text-muted-foreground">
              {section.titleAr}
            </p>
          </div>
          <ul className="bg-background">
            {section.items.map((item) => (
              <CheckRow
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                italianRequired={!!italianRequired[item.id]}
                onToggle={() => toggle(item.id)}
                onToggleItalian={() => toggleItalian(item.id)}
              />
            ))}
          </ul>
        </section>
      ))}

      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Envoyer la liste par e-mail</DialogTitle>
            <DialogDescription>
              Aperçu du message client : ton professionnel, checklist puis éventuellement la partie légalisation Tunisie.
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            <p className="text-sm text-muted-foreground">
              Pièces incluses : <span className="font-medium text-foreground">{doneCount}</span>
            </p>
            <div className="overflow-hidden rounded-md border border-border bg-muted/20">
              <iframe
                title="Aperçu de l’e-mail"
                srcDoc={previewHtml}
                className="h-[220px] w-full border-0"
                sandbox="allow-same-origin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kh-doc-subject">Objet</Label>
              <Input
                id="kh-doc-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={sending}
              />
            </div>
            <div className="space-y-2">
              <Label>Expéditeur</Label>
              <Select
                value={fromKey}
                onValueChange={(v) => setFromKey(v as "default" | "contact" | "italy")}
                disabled={sending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Expéditeur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Proposals (proposals@jeexpert-study.com)</SelectItem>
                  <SelectItem value="contact">Contact (contact@jeexpert-study.com)</SelectItem>
                  <SelectItem value="italy">Italy (italy@jeexpert-study.com)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="kh-doc-to">À (obligatoire)</Label>
              <Input
                id="kh-doc-to"
                type="text"
                placeholder="email@exemple.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                disabled={sending}
              />
              {to.trim().length > 0 ? (
                <p className="text-xs text-muted-foreground" title={to}>
                  Aperçu : {truncateMiddle(to.trim(), 70)}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="kh-doc-cc">Cc</Label>
              <Input
                id="kh-doc-cc"
                type="text"
                placeholder="cc@exemple.com"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                disabled={sending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kh-doc-bcc">Cci</Label>
              <Input
                id="kh-doc-bcc"
                type="text"
                placeholder="cci@exemple.com"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                disabled={sending}
              />
            </div>
            {sendError ? <p className="text-sm text-destructive">{sendError}</p> : null}
          </div>
          <DialogFooter className="shrink-0 border-t pt-4">
            {sendSuccess ? (
              <p className="mr-auto text-sm font-medium text-emerald-600" role="status">
                {sendSuccess}
              </p>
            ) : null}
            <Button type="button" variant="outline" onClick={() => setSendOpen(false)} disabled={sending}>
              Annuler
            </Button>
            <Button type="button" onClick={handleSend} disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  Envoi…
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" aria-hidden />
                  Envoyer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
