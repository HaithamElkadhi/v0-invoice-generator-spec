"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileDown, History, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { generateServiceContractPDF } from "@/lib/service-contract-pdf"
import type { ServiceContractData } from "@/lib/service-contract-types"
import { getPictureUrl, PICTURE_LABELS } from "@/lib/pictures"

const initialData: ServiceContractData = {
  clientName: "",
  sharedEmail: "",
  maxUniversities: "",
  currency: "EUR",
  formulaAcompte: false,
  amountAcompte: "",
  formulaAcceptation: false,
  amountAcceptation: "",
  formulaAcompteBourse: false,
  amountAcompteBourse: "",
  formulaClotureBourse: false,
  amountClotureBourse: "",
  faitA: "",
  contractDate: new Date().toISOString().split("T")[0],
  signatureClientName: "",
  additionalClauses: "",
}

const CONTRACT_HISTORY_KEY = "service-contract-history-v1"

type SavedContractItem = {
  id: string
  savedAt: string
  data: ServiceContractData
}

const normalizeContractData = (value: Partial<ServiceContractData> | undefined): ServiceContractData => ({
  ...initialData,
  ...value,
  currency: value?.currency ?? "EUR",
})

export default function ContratPage() {
  const [data, setData] = useState<ServiceContractData>(initialData)
  const [isGenerating, setIsGenerating] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [savedItems, setSavedItems] = useState<SavedContractItem[]>([])

  const updateData = (updates: Partial<ServiceContractData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const loadSaved = () => {
    if (typeof window === "undefined") return
    try {
      const raw = window.localStorage.getItem(CONTRACT_HISTORY_KEY)
      if (!raw) {
        setSavedItems([])
        return
      }
      const parsed = JSON.parse(raw) as SavedContractItem[]
      if (!Array.isArray(parsed)) {
        setSavedItems([])
        return
      }
      setSavedItems(
        parsed.map((item) => ({
          ...item,
          data: normalizeContractData(item.data),
        }))
      )
    } catch {
      setSavedItems([])
    }
  }

  useEffect(() => {
    loadSaved()
  }, [])

  const handleSave = () => {
    try {
      const item: SavedContractItem = {
        id: `${Date.now()}`,
        savedAt: new Date().toISOString(),
        data,
      }
      const next = [item, ...savedItems].slice(0, 100)
      setSavedItems(next)
      window.localStorage.setItem(CONTRACT_HISTORY_KEY, JSON.stringify(next))
      alert("Contrat enregistré localement sur cet appareil.")
    } catch (error) {
      console.error("Save contract failed:", error)
      alert("Échec de l'enregistrement local.")
    }
  }

  const handleLoad = (item: SavedContractItem) => {
    setData(normalizeContractData(item.data))
    setHistoryOpen(false)
    alert("Contrat chargé depuis l'historique.")
  }

  const handleDelete = (id: string) => {
    try {
      const next = savedItems.filter((item) => item.id !== id)
      setSavedItems(next)
      window.localStorage.setItem(CONTRACT_HISTORY_KEY, JSON.stringify(next))
    } catch (error) {
      console.error("Delete contract failed:", error)
      alert("Échec de la suppression.")
    }
  }

  const handleGeneratePDF = async (payload?: ServiceContractData) => {
    const d = payload ?? data
    if (!d.clientName.trim() || !d.sharedEmail.trim()) {
      alert("Veuillez renseigner au minimum le nom du client et l'adresse e-mail partagée.")
      return
    }
    setIsGenerating(true)
    try {
      await generateServiceContractPDF(d)
    } catch (error) {
      console.error("PDF error:", error)
      alert("Erreur lors de la génération du PDF.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <img src={getPictureUrl(PICTURE_LABELS.LogoApp)} alt="Jeexpert" className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold text-[rgb(41,84,144)]">Contrat de prestation</h1>
                <p className="text-sm text-muted-foreground">JEEXPERT STUDY — Italie</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-[rgb(41,84,144)] text-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/10"
                onClick={handleSave}
              >
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
              <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[rgb(41,84,144)] text-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/10"
                    onClick={loadSaved}
                  >
                    <History className="mr-2 h-4 w-4" />
                    Historique
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Historique des contrats</DialogTitle>
                    <DialogDescription>
                      Données stockées uniquement sur ce navigateur. Cliquez sur une ligne pour recharger le
                      formulaire, ou sur PDF pour télécharger sans recharger.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="max-h-[55vh] space-y-2 overflow-y-auto rounded-md border p-2">
                    {savedItems.length === 0 && (
                      <p className="p-3 text-sm text-muted-foreground">Aucun contrat enregistré.</p>
                    )}
                    {savedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-wrap items-center gap-2 rounded-md border px-3 py-2"
                      >
                        <button
                          type="button"
                          onClick={() => handleLoad(item)}
                          className="min-w-0 flex-1 text-left text-sm hover:text-[rgb(41,84,144)]"
                        >
                          <p className="truncate font-medium text-foreground">
                            {item.data.clientName || "Sans nom"}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {item.data.sharedEmail || "—"} ·{" "}
                            {new Date(item.savedAt).toLocaleString("fr-FR")}
                          </p>
                        </button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="shrink-0 border-[rgb(41,84,144)] text-[rgb(41,84,144)]"
                          disabled={isGenerating}
                          onClick={(e) => {
                            e.stopPropagation()
                            void handleGeneratePDF(item.data)
                          }}
                        >
                          <FileDown className="mr-1 h-4 w-4" />
                          PDF
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(item.id)
                          }}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                type="button"
                onClick={() => void handleGeneratePDF()}
                disabled={isGenerating}
                className="bg-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/90"
              >
                <FileDown className="mr-2 h-4 w-4" />
                {isGenerating ? "Génération…" : "Télécharger PDF"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/generator"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[rgb(41,84,144)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au générateur
        </Link>

        <p className="mb-6 text-sm text-muted-foreground">
          Renseignez les champs variables du contrat. Le PDF reprend le texte standard JEEXPERT ; la zone «
          Précisions » permet d&apos;ajouter des clauses ou modifications visibles dans le document.
        </p>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">Client et e-mail partagé</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="clientName">Nom du client</Label>
                <Input
                  id="clientName"
                  placeholder="Nom et prénom"
                  value={data.clientName}
                  onChange={(e) => updateData({ clientName: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="sharedEmail">Adresse e-mail partagée (article 2)</Label>
                <Input
                  id="sharedEmail"
                  type="email"
                  placeholder="exemple@domaine.com"
                  value={data.sharedEmail}
                  onChange={(e) => updateData({ sharedEmail: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">Formules et montants (article 6)</h2>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise des montants</Label>
                  <Select
                    value={data.currency}
                    onValueChange={(value: "EUR" | "USD" | "TND") => updateData({ currency: value })}
                  >
                    <SelectTrigger id="currency" className="w-full">
                      <SelectValue placeholder="Sélectionner une devise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="USD">Dollar (USD)</SelectItem>
                      <SelectItem value="TND">Dinar tunisien (TND)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUniversities">Nombre max. d&apos;universités (X) — formule acompte</Label>
                  <Input
                    id="maxUniversities"
                    inputMode="numeric"
                    placeholder="ex. 5"
                    value={data.maxUniversities}
                    onChange={(e) => updateData({ maxUniversities: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-md border border-border p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="fA"
                    checked={data.formulaAcompte}
                    onCheckedChange={(v) => updateData({ formulaAcompte: v === true })}
                    className="mt-1"
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Label htmlFor="amountAcompte" className="cursor-pointer font-medium leading-tight">
                      Acompte – Frais d&apos;accompagnement administratif (Admission)
                    </Label>
                    <Input
                      id="amountAcompte"
                      placeholder={`Montant (${data.currency})`}
                      value={data.amountAcompte}
                      onChange={(e) => updateData({ amountAcompte: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="fB"
                    checked={data.formulaAcceptation}
                    onCheckedChange={(v) => updateData({ formulaAcceptation: v === true })}
                    className="mt-1"
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Label htmlFor="amountAcceptation" className="cursor-pointer font-medium leading-tight">
                      Frais d&apos;acceptation – Clôture du service (Admission)
                    </Label>
                    <Input
                      id="amountAcceptation"
                      placeholder={`Montant (${data.currency}), payable si admission`}
                      value={data.amountAcceptation}
                      onChange={(e) => updateData({ amountAcceptation: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="fC"
                    checked={data.formulaAcompteBourse}
                    onCheckedChange={(v) => updateData({ formulaAcompteBourse: v === true })}
                    className="mt-1"
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Label htmlFor="amountAcompteBourse" className="cursor-pointer font-medium leading-tight">
                      Acompte - Frais Administratif Dossier Bourse
                    </Label>
                    <Input
                      id="amountAcompteBourse"
                      placeholder={`Montant (${data.currency})`}
                      value={data.amountAcompteBourse}
                      onChange={(e) => updateData({ amountAcompteBourse: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="fD"
                    checked={data.formulaClotureBourse}
                    onCheckedChange={(v) => updateData({ formulaClotureBourse: v === true })}
                    className="mt-1"
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Label htmlFor="amountClotureBourse" className="cursor-pointer font-medium leading-tight">
                      Frais Cloture Bourse si Obtenu
                    </Label>
                    <Input
                      id="amountClotureBourse"
                      placeholder={`Montant (${data.currency}), payable si bourse obtenue`}
                      value={data.amountClotureBourse}
                      onChange={(e) => updateData({ amountClotureBourse: e.target.value })}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">Signatures (article 10)</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="faitA">Fait à</Label>
                <Input
                  id="faitA"
                  placeholder="Ville"
                  value={data.faitA}
                  onChange={(e) => updateData({ faitA: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractDate">Date</Label>
                <Input
                  id="contractDate"
                  type="date"
                  value={data.contractDate}
                  onChange={(e) => updateData({ contractDate: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="signatureClientName">Signature du client (nom lisible)</Label>
                <Input
                  id="signatureClientName"
                  placeholder="Nom complet"
                  value={data.signatureClientName}
                  onChange={(e) => updateData({ signatureClientName: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[rgb(41,84,144)]">Précisions / modifications (optionnel)</h2>
            <Textarea
              placeholder="Ajoutez ici toute clause additionnelle ou précision ; elle apparaîtra dans le PDF avant les signatures."
              className="min-h-[120px] resize-y"
              value={data.additionalClauses}
              onChange={(e) => updateData({ additionalClauses: e.target.value })}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
