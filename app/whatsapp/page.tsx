import { Suspense } from "react"
import { WhatsAppClient } from "./whatsapp-client"

export default function WhatsAppPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
          Loading…
        </div>
      }
    >
      <WhatsAppClient />
    </Suspense>
  )
}
