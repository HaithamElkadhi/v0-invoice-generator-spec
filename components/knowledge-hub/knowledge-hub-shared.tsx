import type { ReactNode } from "react"

export const C = {
  navy: "#1a2b4b",
  red: "#c62828",
  green: "#009432",
  lightBlue: "#eef2f7",
  lightGreen: "#f1f9f1",
  gold: "#c9a227",
} as const

export function BilingualRow({
  fr,
  ar,
  className = "",
}: {
  fr: ReactNode
  ar: ReactNode
  className?: string
}) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 sm:gap-6 ${className}`}>
      <div className="text-left text-sm leading-relaxed">{fr}</div>
      <div dir="rtl" lang="ar" className="text-right text-sm leading-relaxed">
        {ar}
      </div>
    </div>
  )
}
