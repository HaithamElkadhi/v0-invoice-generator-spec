import type { InvoiceDataWithTotals } from "./invoice-types"
import { COMPANY_INFO, PAYPAL_EMAIL, BANK_DETAILS, formatInvoiceCurrency } from "./invoice-types"

function escapeHtml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ""
  const [y, m, d] = dateStr.split("-")
  return d && m && y ? `${d}/${m}/${y}` : dateStr
}

export function buildInvoiceEmailBody(data: InvoiceDataWithTotals): string {
  const paymentLabels: string[] = []
  if (data.paymentMethods.paypal) paymentLabels.push(`PayPal: ${PAYPAL_EMAIL}`)
  if (data.paymentMethods.bankTransfer) {
    paymentLabels.push(
      `Bank transfer – ${BANK_DETAILS.bank}, IBAN: ${BANK_DETAILS.iban}, BIC: ${BANK_DETAILS.bic}, Account: ${BANK_DETAILS.accountHolder}`
    )
  }
  if (data.paymentMethods.other) paymentLabels.push("Other (see details)")

  const itemsRows = data.items
    .filter((item) => item.description?.trim())
    .map(
      (item) =>
        `<tr>
          <td style="padding:6px 12px 6px 0;vertical-align:top;font-size:14px;color:#111;">${escapeHtml(item.description)}</td>
          <td style="padding:6px 8px;text-align:center;font-size:14px;">${item.quantity}</td>
          <td style="padding:6px 8px;text-align:right;font-size:14px;">${formatInvoiceCurrency(item.unitPrice, data.currency)}</td>
          <td style="padding:6px 0 6px 8px;text-align:right;font-size:14px;">${formatInvoiceCurrency(item.quantity * item.unitPrice, data.currency)}</td>
        </tr>`
    )
    .join("")

  const tableStyle =
    "width:100%;border-collapse:collapse;font-family:Arial,sans-serif;margin:8px 0;"
  const thStyle =
    "padding:8px 12px 8px 0;text-align:left;font-size:12px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb;"
  const thRight =
    "padding:8px 8px;text-align:right;font-size:12px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb;"

  const itemsTable =
    itemsRows &&
    `<table style="${tableStyle}">
  <thead><tr>
    <th style="${thStyle}">Description</th>
    <th style="${thRight}">Qty</th>
    <th style="${thRight}">Unit price</th>
    <th style="${thRight}">Amount</th>
  </tr></thead>
  <tbody>${itemsRows}</tbody>
</table>`

  const discountSection =
    data.discountEnabled && data.discountPercentage > 0
      ? `<p style="margin:12px 0 4px;font-size:14px;"><strong>Discount:</strong> ${data.discountPercentage}%${data.discountReason?.trim() ? ` – ${escapeHtml(data.discountReason)}` : ""}</p>
  <p style="margin:0 0 12px;font-size:14px;">Discount amount: ${formatInvoiceCurrency(data.discountAmount, data.currency)}</p>`
      : ""

  const paymentSection =
    paymentLabels.length > 0
      ? `<p style="margin:12px 0 4px;font-size:14px;"><strong>Payment methods</strong></p>
  <ul style="margin:0 0 12px;padding-left:20px;font-size:14px;">${paymentLabels.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}</ul>`
      : ""

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#111;">
  <p style="margin:0 0 16px;">
    Dear ${escapeHtml(data.clientName || "Client")},
  </p>
  <p style="margin:0 0 16px;">
    Please find below the details of your invoice from ${escapeHtml(COMPANY_INFO.name)}.
  </p>

  <p style="margin:16px 0 4px;font-size:14px;"><strong>Invoice number:</strong> ${escapeHtml(data.invoiceNumber || "—")}</p>
  <p style="margin:0 0 4px;font-size:14px;"><strong>Date:</strong> ${formatDate(data.date)}</p>
  <p style="margin:0 0 12px;font-size:14px;"><strong>Due date:</strong> ${formatDate(data.dueDate) || "—"}</p>

  <p style="margin:12px 0 4px;font-size:14px;"><strong>Bill to</strong></p>
  <p style="margin:0 0 4px;font-size:14px;">${escapeHtml(data.clientName)}</p>
  ${data.clientAddress?.trim() ? `<p style="margin:0 0 12px;font-size:14px;white-space:pre-line;">${escapeHtml(data.clientAddress)}</p>` : ""}

  <p style="margin:16px 0 4px;font-size:14px;"><strong>Items</strong></p>
  ${itemsTable || "<p style='margin:0 0 12px;font-size:14px;'>No items.</p>"}
  ${discountSection}

  <p style="margin:12px 0 4px;font-size:14px;"><strong>Subtotal:</strong> ${formatInvoiceCurrency(data.subtotal, data.currency)}</p>
  ${data.discountEnabled && data.discountAmount > 0 ? `<p style="margin:0 0 4px;font-size:14px;"><strong>Discount:</strong> ${formatInvoiceCurrency(data.discountAmount, data.currency)}</p>` : ""}
  <p style="margin:8px 0 12px;font-size:15px;font-weight:700;"><strong>Total:</strong> ${formatInvoiceCurrency(data.finalTotal, data.currency)}</p>

  ${paymentSection}

  <p style="margin:24px 0 0;">
    If you have any questions, please contact us at ${escapeHtml(COMPANY_INFO.email)} or ${escapeHtml(COMPANY_INFO.phone)}.
  </p>
  <p style="margin:16px 0 0;">
    Best regards,<br/>
    ${escapeHtml(COMPANY_INFO.name)}
  </p>
</body>
</html>`.trim()
}
