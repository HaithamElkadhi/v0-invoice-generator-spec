import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import {
  COMPANY_INFO,
  BANK_DETAILS_IT,
  BANK_DETAILS_TN,
  BRAND_COLORS,
  formatInvoiceCurrency,
  type InvoiceDataWithTotals,
} from "./invoice-types"

const formatDateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return ""
  const [year, month, day] = dateString.split("-")
  return `${day}/${month}/${year}`
}

const loadImage = (url: string): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    const timeout = setTimeout(() => {
      resolve(null)
    }, 2000)

    img.onload = () => {
      clearTimeout(timeout)
      resolve(img)
    }

    img.onerror = () => {
      clearTimeout(timeout)
      resolve(null)
    }

    img.src = url
  })
}

export async function generateInvoicePDF(data: InvoiceDataWithTotals) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  const { primary, accent } = BRAND_COLORS

  let yPos = margin

  // Try to load and add logo
  const logoImg = await loadImage(COMPANY_INFO.logoUrl)

  if (logoImg) {
    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      canvas.width = logoImg.width
      canvas.height = logoImg.height
      ctx?.drawImage(logoImg, 0, 0)
      const logoDataUrl = canvas.toDataURL("image/png")
      doc.addImage(logoDataUrl, "PNG", margin, yPos, 15, 15)
    } catch {
      // Logo failed, continue without it
    }
  }

  // Company info
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(primary.r, primary.g, primary.b)
  doc.text(COMPANY_INFO.name, margin + (logoImg ? 20 : 0), yPos + 5)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(COMPANY_INFO.email, margin + (logoImg ? 20 : 0), yPos + 10)
  doc.text(COMPANY_INFO.phone, margin + (logoImg ? 20 : 0), yPos + 14)
  doc.text(COMPANY_INFO.website, margin + (logoImg ? 20 : 0), yPos + 18)

  // INVOICE title
  doc.setFont("helvetica", "bold")
  doc.setFontSize(28)
  doc.setTextColor(primary.r, primary.g, primary.b)
  doc.text("INVOICE", pageWidth - margin, yPos + 5, { align: "right" })

  // Invoice details box
  yPos += 25
  const boxWidth = 60
  const boxX = pageWidth - margin - boxWidth

  doc.setFillColor(245, 245, 245)
  doc.roundedRect(boxX, yPos, boxWidth, 25, 2, 2, "F")

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)

  const detailsX = boxX + 5
  doc.text("Invoice No:", detailsX, yPos + 7)
  doc.text("Date:", detailsX, yPos + 14)
  doc.text("Due Date:", detailsX, yPos + 21)

  doc.setTextColor(40, 40, 40)
  doc.text(data.invoiceNumber || "DRAFT", detailsX + 25, yPos + 7)
  doc.text(formatDateToDDMMYYYY(data.date), detailsX + 25, yPos + 14)
  doc.text(data.dueDate ? formatDateToDDMMYYYY(data.dueDate) : "-", detailsX + 25, yPos + 21)

  // Client information
  yPos += 35
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(primary.r, primary.g, primary.b)
  doc.text("BILL TO", margin, yPos)

  yPos += 6
  doc.setFontSize(11)
  doc.setTextColor(40, 40, 40)
  doc.text(data.clientName, margin, yPos)

  if (data.clientAddress) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    const addressLines = data.clientAddress.split("\n")
    addressLines.forEach((line) => {
      yPos += 5
      doc.text(line, margin, yPos)
    })
  }

  // Items table
  yPos += 15

  const tableData = data.items
    .filter((item) => item.description.trim())
    .map((item) => [
      item.description,
      item.quantity.toString(),
      formatInvoiceCurrency(item.unitPrice, data.currency),
      formatInvoiceCurrency(item.quantity * item.unitPrice, data.currency),
    ])

  autoTable(doc, {
    startY: yPos,
    head: [["Description", "QTY", "Unit Price", "Total"]],
    body: tableData,
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: [primary.r, primary.g, primary.b],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [40, 40, 40],
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },
    columnStyles: {
      0: { cellWidth: "auto", halign: "left" },
      1: { cellWidth: 20, halign: "right" },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 30, halign: "right" },
    },
  })

  // Get the final Y position after the table
  yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

  // Totals section
  const totalsX = pageWidth - margin - 60
  const totalsValueX = pageWidth - margin

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text("Subtotal", totalsX, yPos)
  doc.setTextColor(40, 40, 40)
  doc.text(formatInvoiceCurrency(data.subtotal, data.currency), totalsValueX, yPos, { align: "right" })

  if (data.discountEnabled && data.discountPercentage > 0) {
    yPos += 7
    doc.setTextColor(100, 100, 100)
    doc.text(`Discount (${data.discountPercentage}%)`, totalsX, yPos)
    doc.setTextColor(accent.r, accent.g, accent.b)
    doc.text(`-${formatInvoiceCurrency(data.discountAmount, data.currency)}`, totalsValueX, yPos, {
      align: "right",
    })

    if (data.discountReason) {
      yPos += 5
      doc.setFontSize(8)
      doc.setTextColor(120, 120, 120)
      doc.text(`Reason: ${data.discountReason}`, totalsX, yPos)
    }
  }

  // Final total
  yPos += 10
  doc.setFillColor(primary.r, primary.g, primary.b)
  doc.roundedRect(totalsX - 5, yPos - 5, 70, 12, 2, 2, "F")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(255, 255, 255)
  doc.text("TOTAL", totalsX, yPos + 3)
  doc.text(formatInvoiceCurrency(data.finalTotal, data.currency), totalsValueX, yPos + 3, {
    align: "right",
  })

  // Payment methods
  yPos += 25
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(primary.r, primary.g, primary.b)
  doc.text("PAYMENT METHODS", margin, yPos)

  yPos += 7
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(60, 60, 60)

  if (data.paymentMethods.bankTransferItaly) {
    doc.text("• Bank transfer (Italy):", margin + 3, yPos)
    yPos += 5
    doc.text(`    ${BANK_DETAILS_IT.accountHolder}`, margin + 3, yPos)
    yPos += 4
    doc.text(`    Codice Fiscale: ${BANK_DETAILS_IT.codiceFiscale}`, margin + 3, yPos)
    yPos += 4
    doc.text(`    IBAN: ${BANK_DETAILS_IT.iban}`, margin + 3, yPos)
    yPos += 4
    doc.text(`    BIC: ${BANK_DETAILS_IT.bic}`, margin + 3, yPos)
    yPos += 4
    doc.text(`    Bank: ${BANK_DETAILS_IT.bank}`, margin + 3, yPos)
    yPos += 5
  }

  if (data.paymentMethods.bankTransferTunisia) {
    doc.text("• Bank transfer (Tunisia):", margin + 3, yPos)
    yPos += 5
    doc.text(`    Banque: ${BANK_DETAILS_TN.bank}`, margin + 3, yPos)
    yPos += 4
    doc.text(`    Type de compte: ${BANK_DETAILS_TN.accountType}`, margin + 3, yPos)
    yPos += 4
    doc.text(`    Bénéficiaire: ${BANK_DETAILS_TN.beneficiary}`, margin + 3, yPos)
    yPos += 4
    doc.text(`    Adresse: ${BANK_DETAILS_TN.address}`, margin + 3, yPos)
    yPos += 4
    doc.text(`    RIB: ${BANK_DETAILS_TN.rib}`, margin + 3, yPos)
    yPos += 4
    doc.text(`    IBAN: ${BANK_DETAILS_TN.iban}`, margin + 3, yPos)
    yPos += 4
    doc.text(`    Code SWIFT / BIC: ${BANK_DETAILS_TN.swiftBic}`, margin + 3, yPos)
    yPos += 5
  }

  if (data.paymentMethods.other) {
    doc.text("• Other payment methods", margin + 3, yPos)
    yPos += 5
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20

  doc.setFont("helvetica", "italic")
  doc.setFontSize(10)
  doc.setTextColor(primary.r, primary.g, primary.b)
  doc.text("Thank you for your trust.", pageWidth / 2, footerY, {
    align: "center",
  })

  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)
  doc.text("Your Academic Journey Abroad Starts Here", pageWidth / 2, footerY + 6, { align: "center" })

  // Generate filename and save
  const filename = data.invoiceNumber ? `invoice-${data.invoiceNumber}.pdf` : "invoice-draft.pdf"

  doc.save(filename)
}
