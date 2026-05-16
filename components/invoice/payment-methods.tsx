"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { BANK_DETAILS_IT, BANK_DETAILS_TN } from "@/lib/invoice-types"
import type { InvoiceData } from "@/lib/invoice-types"

interface PaymentMethodsProps {
  data: InvoiceData
  onChange: (updates: Partial<InvoiceData>) => void
}

export function PaymentMethods({ data, onChange }: PaymentMethodsProps) {
  const updatePaymentMethod = (method: keyof typeof data.paymentMethods, checked: boolean) => {
    onChange({
      paymentMethods: {
        ...data.paymentMethods,
        [method]: checked,
      },
    })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Select one or more payment methods to display on the invoice</p>

      <div className="space-y-4">
        {/* Bank transfer — Italy */}
        <div className="flex items-start space-x-3 rounded-lg border border-border p-4">
          <Checkbox
            id="bankTransferItaly"
            checked={data.paymentMethods.bankTransferItaly}
            onCheckedChange={(checked) => updatePaymentMethod("bankTransferItaly", checked === true)}
          />
          <div className="space-y-1 min-w-0 flex-1">
            <Label htmlFor="bankTransferItaly" className="cursor-pointer font-medium">
              Bank transfer (Italy)
            </Label>
            <div className="text-sm text-muted-foreground space-y-0.5 mt-2">
              <p>{BANK_DETAILS_IT.accountHolder}</p>
              <p>Codice Fiscale: {BANK_DETAILS_IT.codiceFiscale}</p>
              <p className="font-mono tracking-tight">IBAN: {BANK_DETAILS_IT.iban}</p>
              <p className="font-mono tracking-tight">BIC: {BANK_DETAILS_IT.bic}</p>
              <p>Bank: {BANK_DETAILS_IT.bank}</p>
            </div>
          </div>
        </div>

        {/* Bank transfer — Tunisia */}
        <div className="flex items-start space-x-3 rounded-lg border border-border p-4">
          <Checkbox
            id="bankTransferTunisia"
            checked={data.paymentMethods.bankTransferTunisia}
            onCheckedChange={(checked) => updatePaymentMethod("bankTransferTunisia", checked === true)}
          />
          <div className="space-y-1 min-w-0 flex-1">
            <Label htmlFor="bankTransferTunisia" className="cursor-pointer font-medium">
              Bank transfer (Tunisia)
            </Label>
            <dl className="text-sm text-muted-foreground space-y-0.5 mt-2 border border-border rounded-md divide-y divide-border overflow-hidden">
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-0">
                <dt className="font-medium text-foreground px-3 py-2 bg-muted/40">Banque</dt>
                <dd className="px-3 py-2">{BANK_DETAILS_TN.bank}</dd>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-0">
                <dt className="font-medium text-foreground px-3 py-2 bg-muted/40">Type de compte</dt>
                <dd className="px-3 py-2">{BANK_DETAILS_TN.accountType}</dd>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-0">
                <dt className="font-medium text-foreground px-3 py-2 bg-muted/40">Bénéficiaire</dt>
                <dd className="px-3 py-2">{BANK_DETAILS_TN.beneficiary}</dd>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-0">
                <dt className="font-medium text-foreground px-3 py-2 bg-muted/40">Adresse</dt>
                <dd className="px-3 py-2">{BANK_DETAILS_TN.address}</dd>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-0">
                <dt className="font-medium text-foreground px-3 py-2 bg-muted/40">RIB</dt>
                <dd className="px-3 py-2 font-mono tracking-tight">{BANK_DETAILS_TN.rib}</dd>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-0">
                <dt className="font-medium text-foreground px-3 py-2 bg-muted/40">IBAN</dt>
                <dd className="px-3 py-2 font-mono tracking-tight">{BANK_DETAILS_TN.iban}</dd>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-0">
                <dt className="font-medium text-foreground px-3 py-2 bg-muted/40">Code SWIFT / BIC</dt>
                <dd className="px-3 py-2 font-mono tracking-tight">{BANK_DETAILS_TN.swiftBic}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Other */}
        <div className="flex items-start space-x-3 rounded-lg border border-border p-4">
          <Checkbox
            id="other"
            checked={data.paymentMethods.other}
            onCheckedChange={(checked) => updatePaymentMethod("other", checked === true)}
          />
          <div className="space-y-1">
            <Label htmlFor="other" className="cursor-pointer font-medium">
              Other
            </Label>
            <p className="text-sm text-muted-foreground">Other payment methods</p>
          </div>
        </div>
      </div>
    </div>
  )
}
