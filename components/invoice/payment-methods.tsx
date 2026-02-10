"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { BANK_DETAILS, PAYPAL_EMAIL } from "@/lib/invoice-types"
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
        {/* PayPal */}
        <div className="flex items-start space-x-3 rounded-lg border border-border p-4">
          <Checkbox
            id="paypal"
            checked={data.paymentMethods.paypal}
            onCheckedChange={(checked) => updatePaymentMethod("paypal", checked === true)}
          />
          <div className="space-y-1">
            <Label htmlFor="paypal" className="cursor-pointer font-medium">
              PayPal
            </Label>
            <p className="text-sm text-muted-foreground">{PAYPAL_EMAIL}</p>
          </div>
        </div>

        {/* Bank Transfer */}
        <div className="flex items-start space-x-3 rounded-lg border border-border p-4">
          <Checkbox
            id="bankTransfer"
            checked={data.paymentMethods.bankTransfer}
            onCheckedChange={(checked) => updatePaymentMethod("bankTransfer", checked === true)}
          />
          <div className="space-y-1">
            <Label htmlFor="bankTransfer" className="cursor-pointer font-medium">
              Bank Transfer
            </Label>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p>{BANK_DETAILS.accountHolder}</p>
              <p>Codice Fiscale: {BANK_DETAILS.codiceFiscale}</p>
              <p>IBAN: {BANK_DETAILS.iban}</p>
              <p>BIC: {BANK_DETAILS.bic}</p>
              <p>Bank: {BANK_DETAILS.bank}</p>
            </div>
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
