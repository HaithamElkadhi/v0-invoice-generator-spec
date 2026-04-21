import { COMPANY_INFO } from "./invoice-types"
import {
  PAYMENT_METHOD_LABELS,
  formatAmount,
  formatReceiptDate,
  type PaymentReceiptData,
} from "./payment-receipt-types"

function escapeHtml(value: string): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function buildPaymentReceiptEmailBody(data: PaymentReceiptData): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#111;">
  <p style="margin:0 0 16px;">Dear ${escapeHtml(data.clientName || "Client")},</p>

  <p style="margin:0 0 16px;">
    Please find your payment receipt from ${escapeHtml(COMPANY_INFO.name)}.
  </p>

  <p style="margin:14px 0 4px;"><strong>Reference:</strong> ${escapeHtml(data.invoiceId || "—")}</p>
  <p style="margin:0 0 4px;"><strong>Payment Date:</strong> ${escapeHtml(formatReceiptDate(data.paymentDate))}</p>
  <p style="margin:0 0 12px;"><strong>Purpose:</strong> ${escapeHtml(data.paymentReason || "—")}</p>

  <p style="margin:12px 0 4px;"><strong>Payment summary</strong></p>
  <ul style="margin:0 0 12px;padding-left:20px;">
    <li>Currency: ${escapeHtml(data.currency)}</li>
    <li>Amount: ${escapeHtml(formatAmount(data.amount, data.currency))}</li>
  </ul>

  <p style="margin:12px 0 4px;"><strong>Payment Method:</strong> ${escapeHtml(PAYMENT_METHOD_LABELS[data.paymentMethod])}</p>

  ${
    data.comment.trim()
      ? `<p style="margin:12px 0 4px;"><strong>Comment</strong></p><p style="margin:0 0 12px;white-space:pre-line;">${escapeHtml(data.comment.trim())}</p>`
      : ""
  }

  <p style="margin:20px 0 0;">
    For any question, contact us at ${escapeHtml(COMPANY_INFO.email)} or ${escapeHtml(COMPANY_INFO.phone)}.
  </p>

  <p style="margin:16px 0 0;">
    Best regards,<br />
    ${escapeHtml(COMPANY_INFO.name)}
  </p>
</body>
</html>`.trim()
}
