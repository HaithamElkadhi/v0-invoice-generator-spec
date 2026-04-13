import jsPDF from "jspdf"
import type { ServiceContractData } from "./service-contract-types"

const brandColor: [number, number, number] = [41, 84, 144]
const grayColor: [number, number, number] = [100, 100, 100]

function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return "__________________"
  const d = new Date(isoDate)
  if (Number.isNaN(d.getTime())) return isoDate
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
}

export async function generateServiceContractPDF(data: ServiceContractData): Promise<void> {
  const doc = new jsPDF("p", "mm", "a4")
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - margin * 2
  let y = margin

  const checkPageBreak = (requiredSpace: number) => {
    if (y + requiredSpace > pageHeight - 25) {
      doc.addPage()
      y = margin
    }
  }

  const drawHeader = () => {
    doc.setFillColor(...brandColor)
    doc.rect(0, 0, pageWidth, 35, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("JEEXPERT", margin, 18)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("Your Academic Journey Abroad Starts Here", margin, 26)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("CONTRAT DE PRESTATION DE SERVICES", pageWidth - margin, 20, { align: "right" })
    y = 45
  }

  const drawFooterOnAllPages = () => {
    const drawFooter = () => {
      doc.setFillColor(...brandColor)
      doc.rect(0, pageHeight - 12, pageWidth, 12, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(8)
      doc.text("Your Academic Journey Abroad Starts Here", pageWidth / 2, pageHeight - 5, { align: "center" })
    }
    const n = doc.getNumberOfPages()
    for (let i = 1; i <= n; i++) {
      doc.setPage(i)
      drawFooter()
    }
  }

  const paragraph = (text: string, fontSize = 9, lineHeight = 4.2) => {
    doc.setFontSize(fontSize)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    const lines = doc.splitTextToSize(text, contentWidth)
    const blockH = lines.length * lineHeight
    checkPageBreak(blockH + 2)
    doc.text(lines, margin, y)
    y += blockH + 3
  }

  const heading = (title: string) => {
    checkPageBreak(14)
    doc.setFillColor(...brandColor)
    doc.rect(margin, y, contentWidth, 7, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text(title, margin + 2, y + 5)
    y += 11
    doc.setTextColor(0, 0, 0)
  }

  const mark = (on: boolean) => (on ? "[X]" : "[ ]")
  const currencyLabel = data.currency || "EUR"

  drawHeader()

  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...grayColor)
  if (data.clientName.trim()) {
    doc.text(`Client : ${data.clientName.trim()}`, margin, y)
    y += 6
  }
  y += 2

  heading("1. Objet du contrat")
  paragraph(
    "Le présent contrat a pour objet l'accompagnement du Client dans ses démarches d'admission dans des universités publiques en Italie, incluant l'orientation, la préparation du dossier, le suivi administratif et l'assistance pour les procédures liées (admission, bourse, visa)."
  )

  heading("2. Mandat et représentation")
  paragraph(
    "Le Client autorise JEEXPERT STUDY à agir en tant que mandataire administratif, notamment pour communiquer avec les universités, soumettre les candidatures et gérer une adresse e-mail partagée. Certaines étapes restent strictement personnelles et doivent être effectuées directement par le Client."
  )
  paragraph(
    `Adresse e-mail partagée : le Client conserve en permanence un accès complet (identifiant et mot de passe). L'adresse concernée est : ${data.sharedEmail.trim() || "______________________________"}. Le Prestataire s'interdit de l'utiliser à d'autres fins que celles du présent contrat.`
  )

  heading("3. Responsabilités du Client")
  paragraph(
    "Le Client s'engage à fournir des documents authentiques, exacts et complets, à respecter les délais et à participer aux procédures obligatoires. Le Prestataire n'est pas responsable en cas de documents falsifiés ou d'informations incorrectes."
  )

  heading("4. Limitation des interventions")
  paragraph(
    "JEEXPERT STUDY n'effectue aucun test, entretien ou procédure officielle à la place du Client. Le rôle du Prestataire est d'accompagner, conseiller et préparer le Client."
  )

  heading("5. Vérification du dossier")
  paragraph(
    "JEEXPERT STUDY accompagne le Client dans la préparation et l'optimisation complète de son dossier, en veillant à sa cohérence, sa qualité et sa conformité avec les exigences des universités."
  )
  paragraph(
    "Nous maximisons les chances d'admission et de bourse. Toutefois, les décisions finales restant à la discrétion des institutions (universités, organismes de bourse, autorités consulaires)."
  )

  heading("6. Prestations et conditions financières")
  paragraph("Le Client sélectionne la formule souhaitée parmi les options ci-dessous :")

  const xUni = data.maxUniversities.trim() || "X"
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  checkPageBreak(28)
  doc.text(`${mark(data.formulaAcompte)} Acompte – Frais d'accompagnement administratif (Admission)`, margin, y)
  y += 4
  doc.setFont("helvetica", "normal")
  const acompteLines = doc.splitTextToSize(
    `Inclut : Analyse du profil académique ; Orientation stratégique (choix des universités et programmes) ; Préparation et vérification du dossier ; Soumission des candidatures (jusqu'à ${xUni} universités). Montant : ${data.amountAcompte.trim() || "______"} ${currencyLabel}`,
    contentWidth
  )
  checkPageBreak(acompteLines.length * 4.2 + 6)
  doc.text(acompteLines, margin, y)
  y += acompteLines.length * 4.2 + 5

  doc.setFont("helvetica", "bold")
  doc.text(`${mark(data.formulaAcceptation)} Frais d'acceptation – Clôture du service administratif (Admission)`, margin, y)
  y += 4
  doc.setFont("helvetica", "normal")
  paragraph(`Inclut : Montant : ${data.amountAcceptation.trim() || "______"} ${currencyLabel} (payable en cas d'admission).`)

  doc.setFont("helvetica", "bold")
  checkPageBreak(18)
  doc.text(`${mark(data.formulaAcompteBourse)} Acompte - Frais Administratif Dossier Bourse`, margin, y)
  y += 4
  doc.setFont("helvetica", "normal")
  paragraph(`Inclut : Montant : ${data.amountAcompteBourse.trim() || "______"} ${currencyLabel}.`)

  doc.setFont("helvetica", "bold")
  checkPageBreak(18)
  doc.text(`${mark(data.formulaClotureBourse)} Frais Cloture Bourse si Obtenu`, margin, y)
  y += 4
  doc.setFont("helvetica", "normal")
  paragraph(`Inclut : Montant : ${data.amountClotureBourse.trim() || "______"} ${currencyLabel} (payable si bourse obtenue).`)

  doc.setFont("helvetica", "bold")
  doc.text("Conditions de paiement", margin, y)
  y += 5
  doc.setFont("helvetica", "normal")
  paragraph(
    "Le paiement de l'acompte permet de démarrer les prestations. Il est non remboursable. Les frais complémentaires deviennent exigibles selon la formule choisie et l'avancement du dossier (notamment en cas d'admission). En cas de non-paiement, le Prestataire se réserve le droit de suspendre ou arrêter les services."
  )

  heading("7. Résultats et réengagement")
  paragraph(
    "En cas de non-admission, le Client peut bénéficier d'un nouvel accompagnement pour une prochaine rentrée sans repayer les frais de service (hors frais externes)."
  )

  heading("8. Protection des données")
  paragraph(
    "Les données du Client sont traitées conformément au RGPD et peuvent être supprimées en cas d'inactivité."
  )

  heading("9. Durée et résiliation")
  paragraph(
    "Le contrat prend effet à la signature et peut être résilié en cas de non-respect des engagements ou de non-paiement."
  )

  heading("10. Acceptation")
  paragraph("Le Client reconnaît avoir lu et accepté les conditions du présent contrat.")

  if (data.additionalClauses.trim()) {
    heading("Précisions / modifications convenues")
    paragraph(data.additionalClauses.trim(), 9, 4.2)
  }

  checkPageBreak(28)
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text(`Fait à : ${data.faitA.trim() || "__________________"}`, margin, y)
  y += 5
  doc.text(`Date : ${formatDisplayDate(data.contractDate)}`, margin, y)
  y += 5
  doc.text(
    `Signature du Client : ${data.signatureClientName.trim() || "__________________"}`,
    margin,
    y
  )
  y += 10

  drawFooterOnAllPages()

  const safeName = (data.clientName || "Contrat").replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 40)
  const day = data.contractDate ? data.contractDate.split("T")[0] : new Date().toISOString().split("T")[0]
  doc.save(`Contrat_Jeexpert_${safeName}_${day}.pdf`)
}
