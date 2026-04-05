import { NextRequest, NextResponse } from "next/server"

function isAllowedAttachmentHost(hostname: string): boolean {
  const h = hostname.toLowerCase()
  return h.endsWith("airtableusercontent.com") || h.endsWith("airtable.com")
}

/**
 * Shortens long attachment URLs (e.g. Airtable) so WhatsApp messages show a small clickable link
 * instead of multi-line raw URLs. Plain text cannot hide URLs behind custom titles in WhatsApp.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const url = typeof body.url === "string" ? body.url.trim() : ""
    if (!url || url.length > 8000) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
    }
    let parsed: URL
    try {
      parsed = new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
    }
    if (!isAllowedAttachmentHost(parsed.hostname)) {
      return NextResponse.json(
        { error: "Only Airtable attachment URLs can be shortened" },
        { status: 403 }
      )
    }

    const isGdApi = `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`
    const r1 = await fetch(isGdApi, { cache: "no-store" })
    const t1 = (await r1.text()).trim()
    if (t1.startsWith("http://") || t1.startsWith("https://")) {
      return NextResponse.json({ shortUrl: t1 })
    }

    const tinyApi = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
    const r2 = await fetch(tinyApi, { cache: "no-store" })
    const t2 = (await r2.text()).trim()
    if (t2.startsWith("http://") || t2.startsWith("https://")) {
      return NextResponse.json({ shortUrl: t2 })
    }

    return NextResponse.json(
      { error: "Could not shorten link. Try again later." },
      { status: 502 }
    )
  } catch (e) {
    console.error("[shorten-url]", e)
    return NextResponse.json({ error: "Shorten failed" }, { status: 500 })
  }
}
