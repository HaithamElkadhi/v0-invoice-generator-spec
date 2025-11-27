"use client"

interface TotalsSummaryProps {
  subtotal: number
  discountEnabled: boolean
  discountPercentage: number
  discountAmount: number
  finalTotal: number
}

export function TotalsSummary({
  subtotal,
  discountEnabled,
  discountPercentage,
  discountAmount,
  finalTotal,
}: TotalsSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  return (
    <div className="flex justify-end">
      <div className="w-full max-w-xs space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>

        {discountEnabled && discountPercentage > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount ({discountPercentage}%)</span>
            <span className="font-medium text-[rgb(220,53,69)]">-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        <div className="border-t border-border pt-3">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-[rgb(41,84,144)]">Total</span>
            <span className="text-lg font-bold text-[rgb(41,84,144)]">{formatCurrency(finalTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
