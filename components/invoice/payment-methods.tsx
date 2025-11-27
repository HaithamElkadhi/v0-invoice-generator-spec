"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { BANK_DETAILS, COMPANY_INFO } from "@/lib/invoice-types"
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
            <p className="text-sm text-muted-foreground">{COMPANY_INFO.email}</p>
          </div>
        </div>

        {/* Cash */}
        <div className="flex items-start space-x-3 rounded-lg border border-border p-4">
          <Checkbox
            id="cash"
            checked={data.paymentMethods.cash}
            onCheckedChange={(checked) => updatePaymentMethod("cash", checked === true)}
          />
          <div className="space-y-1">
            <Label htmlFor="cash" className="cursor-pointer font-medium">
              Cash
            </Label>
            <p className="text-sm text-muted-foreground">Cash payment accepted</p>
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
              <p>IBAN: {BANK_DETAILS.iban}</p>
              <p>SWIFT/BIC: {BANK_DETAILS.swift}</p>
              <p>Bank: {BANK_DETAILS.bank}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
