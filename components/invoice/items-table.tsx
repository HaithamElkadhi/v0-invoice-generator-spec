"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { InvoiceData, InvoiceItem } from "@/lib/invoice-types"

interface ItemsTableProps {
  data: InvoiceData
  onChange: (updates: Partial<InvoiceData>) => void
}

export function ItemsTable({ data, onChange }: ItemsTableProps) {
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unitPrice: 0,
    }
    onChange({ items: [...data.items, newItem] })
  }

  const removeItem = (id: string) => {
    if (data.items.length === 1) return
    onChange({ items: data.items.filter((item) => item.id !== id) })
  }

  const updateItem = (id: string, updates: Partial<InvoiceItem>) => {
    onChange({
      items: data.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Description</th>
              <th className="pb-3 text-right text-sm font-medium text-muted-foreground w-24">Qty</th>
              <th className="pb-3 text-right text-sm font-medium text-muted-foreground w-32">Unit Price</th>
              <th className="pb-3 text-right text-sm font-medium text-muted-foreground w-32">Total</th>
              <th className="pb-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.items.map((item) => (
              <tr key={item.id}>
                <td className="py-3 pr-4">
                  <Input
                    placeholder="Enter description"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                  />
                </td>
                <td className="py-3 pr-4">
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, {
                        quantity: Math.max(1, Number.parseInt(e.target.value) || 1),
                      })
                    }
                    className="text-right"
                  />
                </td>
                <td className="py-3 pr-4">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(item.id, {
                        unitPrice: Math.max(0, Number.parseFloat(e.target.value) || 0),
                      })
                    }
                    className="text-right"
                  />
                </td>
                <td className="py-3 pr-4 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                <td className="py-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    disabled={data.items.length === 1}
                    className="text-muted-foreground hover:text-[rgb(220,53,69)]"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {data.items.map((item, index) => (
          <div key={item.id} className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Item {index + 1}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                disabled={data.items.length === 1}
                className="text-muted-foreground hover:text-[rgb(220,53,69)] -mr-2"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove item</span>
              </Button>
            </div>
            <Input
              placeholder="Description"
              value={item.description}
              onChange={(e) => updateItem(item.id, { description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(item.id, {
                      quantity: Math.max(1, Number.parseInt(e.target.value) || 1),
                    })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Unit Price</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) =>
                    updateItem(item.id, {
                      unitPrice: Math.max(0, Number.parseFloat(e.target.value) || 0),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">Line Total</span>
              <span className="font-semibold">{formatCurrency(item.quantity * item.unitPrice)}</span>
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" onClick={addItem} className="w-full border-dashed bg-transparent">
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
    </div>
  )
}
