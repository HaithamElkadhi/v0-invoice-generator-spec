"use client"

import { useCallback, useMemo, useState } from "react"
import { Languages, Loader2, Mail, Send } from "lucide-react"
import { TRADUCTEURS_ASSERMENTES } from "@/components/knowledge-hub/traducteurs-assermentes-data"
import { buildTraducteursAssermentesEmailHtml } from "@/components/knowledge-hub/traducteurs-assermentes-email-html"
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

const DEFAULT_MAIL_SUBJECT = "Jeexpert — Liste des traducteurs assermentés (Tunisie)"

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

export function TraducteursAssermentesContent() {
  const [sendOpen, setSendOpen] = useState(false)
  const [subject, setSubject] = useState(DEFAULT_MAIL_SUBJECT)
  const [fromKey, setFromKey] = useState<"default" | "contact" | "italy">("default")
  const [to, setTo] = useState("")
  const [cc, setCc] = useState("")
  const [bcc, setBcc] = useState("")
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [sendSuccess, setSendSuccess] = useState<string | null>(null)

  const previewHtml = useMemo(() => buildTraducteursAssermentesEmailHtml(), [])

  const openSendDialog = useCallback(() => {
    setSubject(DEFAULT_MAIL_SUBJECT)
    setFromKey("default")
    setTo("")
    setCc("")
    setBcc("")
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
    setSending(true)
    setSendError(null)
    setSendSuccess(null)
    try {
      const html = buildTraducteursAssermentesEmailHtml()
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

  return (
    <>
      <header className="mb-8 border-b border-border pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
              <Languages className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Knowledge Hub</p>
              <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-foreground">
                Liste des traducteurs assermentés
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Coordonnées indicatives pour la Tunisie. Vérifiez directement auprès du professionnel la langue
                (italien, etc.) et les délais.
              </p>
            </div>
          </div>
          <Button type="button" variant="secondary" className="shrink-0" onClick={openSendDialog}>
            <Mail className="mr-2 h-4 w-4" aria-hidden />
            Envoyer par mail
          </Button>
        </div>
      </header>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left">
              <th className="px-4 py-3 font-semibold text-foreground">Nom</th>
              <th className="px-4 py-3 font-semibold text-foreground">Adresse</th>
              <th className="px-4 py-3 font-semibold text-foreground">Téléphone</th>
              <th className="px-4 py-3 font-semibold text-foreground">Email</th>
            </tr>
          </thead>
          <tbody>
            {TRADUCTEURS_ASSERMENTES.map((row) => (
              <tr key={row.email} className="border-b border-border last:border-0">
                <td className="align-top px-4 py-3 font-medium text-foreground">{row.nom}</td>
                <td className="align-top px-4 py-3 text-muted-foreground">{row.adresse}</td>
                <td className="align-top px-4 py-3 whitespace-nowrap text-muted-foreground">{row.telephone}</td>
                <td className="align-top px-4 py-3">
                  <a
                    href={`mailto:${row.email}`}
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    {row.email}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Envoyer la liste par e-mail</DialogTitle>
            <DialogDescription>
              Le message reprend le tableau des traducteurs (nom, adresse, téléphone, email) au format HTML.
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            <div className="overflow-hidden rounded-md border border-border bg-muted/20">
              <iframe
                title="Aperçu de l’e-mail"
                srcDoc={previewHtml}
                className="h-[220px] w-full border-0"
                sandbox="allow-same-origin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kh-trad-subject">Objet</Label>
              <Input
                id="kh-trad-subject"
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
              <Label htmlFor="kh-trad-to">À (obligatoire)</Label>
              <Input
                id="kh-trad-to"
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
              <Label htmlFor="kh-trad-cc">Cc</Label>
              <Input
                id="kh-trad-cc"
                type="text"
                placeholder="cc@exemple.com"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                disabled={sending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kh-trad-bcc">Cci</Label>
              <Input
                id="kh-trad-bcc"
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
    </>
  )
}
