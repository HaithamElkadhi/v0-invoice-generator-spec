import { TRADUCTEURS_ASSERMENTES } from "./traducteurs-assermentes-data"

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function buildTraducteursAssermentesEmailHtml(): string {
  let inner = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#222;max-width:720px;">`
  inner += `<p style="margin:0 0 16px;">Bonjour,</p>`
  inner += `<p style="margin:0 0 16px;">Vous trouverez ci-dessous une liste indicative de traducteurs assermentés en Tunisie. Nous vous invitons à confirmer langues, disponibilités et tarifs directement auprès des professionnels.</p>`
  inner += `<table style="width:100%;border-collapse:collapse;margin:16px 0;" cellpadding="0" cellspacing="0">`
  inner += `<tr style="background:#f8f9fa;">`
  inner += `<th style="padding:8px;border:1px solid #e2e8f0;text-align:left;font-size:12px;font-weight:600;">Nom</th>`
  inner += `<th style="padding:8px;border:1px solid #e2e8f0;text-align:left;font-size:12px;font-weight:600;">Adresse</th>`
  inner += `<th style="padding:8px;border:1px solid #e2e8f0;text-align:left;font-size:12px;font-weight:600;">Téléphone</th>`
  inner += `<th style="padding:8px;border:1px solid #e2e8f0;text-align:left;font-size:12px;font-weight:600;">Email</th>`
  inner += `</tr>`
  for (const row of TRADUCTEURS_ASSERMENTES) {
    const mailText = escapeHtml(row.email)
    const mailHref = encodeURIComponent(row.email)
    inner += `<tr>`
    inner += `<td style="padding:8px;border:1px solid #e2e8f0;vertical-align:top;">${escapeHtml(row.nom)}</td>`
    inner += `<td style="padding:8px;border:1px solid #e2e8f0;vertical-align:top;">${escapeHtml(row.adresse)}</td>`
    inner += `<td style="padding:8px;border:1px solid #e2e8f0;vertical-align:top;white-space:nowrap;">${escapeHtml(row.telephone)}</td>`
    inner += `<td style="padding:8px;border:1px solid #e2e8f0;vertical-align:top;"><a href="mailto:${mailHref}" style="color:#1d4ed8;">${mailText}</a></td>`
    inner += `</tr>`
  }
  inner += `</table>`
  inner += `<p style="margin:24px 0 0;">Cordialement,<br/>Jeexpert</p>`
  inner += `</div>`
  return inner
}
