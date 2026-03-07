"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const WHATSAPP_TEMPLATES = [
  { id: "__none__", label: "No template", message: "" },
  {
    id: "follow-up",
    label: "Follow-up",
    message:
      "Hello, this is a follow-up regarding your application. Please let us know if you have any questions.",
  },
  {
    id: "missing-documents",
    label: "Missing documents",
    message:
      "Hello, we noticed that some documents are missing from your application. Could you please send them at your earliest convenience?",
  },
  {
    id: "admission-update",
    label: "Admission update",
    message:
      "Hello, we have an update on your admission status. Please check your email or contact us for details.",
  },
  {
    id: "payment-reminder",
    label: "Payment reminder",
    message:
      "Hello, this is a friendly reminder that a payment is pending. Please complete it when possible.",
  },
] as const

/** Normalize phone to digits only (for wa.me URL). Keeps leading + in display. */
function phoneToDigits(value: string): string {
  return value.replace(/\D/g, "")
}

export interface WhatsAppSendDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Pre-fill phone when opening from a lead/client (e.g. +393123456789) */
  initialPhone?: string
  /** Pre-fill message when opening from context */
  initialMessage?: string
}

export function WhatsAppSendDialog({
  open,
  onOpenChange,
  initialPhone = "",
  initialMessage = "",
}: WhatsAppSendDialogProps) {
  const [phone, setPhone] = useState(initialPhone)
  const [message, setMessage] = useState(initialMessage)
  const [templateId, setTemplateId] = useState<string>("__none__")
  const [phoneTouched, setPhoneTouched] = useState(false)

  useEffect(() => {
    if (open) {
      setPhone(initialPhone)
      setMessage(initialMessage)
      setTemplateId("__none__")
      setPhoneTouched(false)
    }
  }, [open, initialPhone, initialMessage])

  const handlePhoneChange = (value: string) => {
    setPhone(value)
  }

  const phoneDigits = phoneToDigits(phone)
  const phoneValid = phoneDigits.length >= 9
  const messageValid = message.trim().length > 0
  const formValid = phoneValid && messageValid

  const handleTemplateChange = (id: string) => {
    setTemplateId(id)
    const t = WHATSAPP_TEMPLATES.find((x) => x.id === id)
    if (t?.message) setMessage(t.message)
    else if (id === "__none__") setMessage("")
  }

  const handleSend = () => {
    if (!formValid) return
    const digits = phoneToDigits(phone)
    const url = `https://wa.me/${digits}?text=${encodeURIComponent(message.trim())}`
    window.open(url, "_blank", "noopener,noreferrer")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
            Send via WhatsApp
          </DialogTitle>
          <DialogDescription>
            Enter the client&apos;s phone number and message. WhatsApp will open with the message ready to send.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="whatsapp-phone">
              Phone Number <span className="text-[rgb(220,53,69)]">*</span>
            </Label>
            <Input
              id="whatsapp-phone"
              type="tel"
              placeholder="+393123456789"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onBlur={() => setPhoneTouched(true)}
              aria-invalid={phoneTouched && !phoneValid}
            />
            {phoneTouched && !phoneValid && phone.length > 0 && (
              <p className="text-xs text-destructive">
                Enter a valid number with country code (e.g. +39 312 345 6789)
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Spaces, dashes and symbols are removed automatically. Only digits are sent to WhatsApp.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp-template">Template (optional)</Label>
            <Select value={templateId} onValueChange={handleTemplateChange}>
              <SelectTrigger id="whatsapp-template" className="w-full">
                <SelectValue placeholder="Choose a template..." />
              </SelectTrigger>
              <SelectContent>
                {WHATSAPP_TEMPLATES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp-message">
              Message <span className="text-[rgb(220,53,69)]">*</span>
            </Label>
            <Textarea
              id="whatsapp-message"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              aria-invalid={message.trim().length === 0}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleSend}
            disabled={!formValid}
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white"
          >
            Send via WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
