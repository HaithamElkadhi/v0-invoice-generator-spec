/**
 * Central registry of picture/asset URLs by label.
 * Add or edit URLs here; use getPictureUrl(label) in code instead of hardcoding links.
 * See also: public/pictures-link.md (docs + Cloudinary account).
 */

export const PICTURE_LABELS = {
  /** Main logo (Cloudinary – Jeexpert_Logo_base) */
  MainLogo: "MainLogo",
  /** Brand logo (Cloudinary – used in emails, etc.) */
  Logo: "Logo",
  /** In-app logo (local asset – header, invoice PDF, etc.) */
  LogoApp: "LogoApp",
} as const

export type PictureLabel = (typeof PICTURE_LABELS)[keyof typeof PICTURE_LABELS]

const PICTURE_URLS: Record<PictureLabel, string> = {
  [PICTURE_LABELS.MainLogo]:
    "https://res.cloudinary.com/dimphakpq/image/upload/v1772323896/Jeexpert_Logo_base_jb2ibb.png",
  [PICTURE_LABELS.Logo]:
    "https://res.cloudinary.com/dimphakpq/image/upload/v1772323281/ChatGPT_Image_23_f%C3%A9vr._2026_17_00_17_ehqz3n.png",
  [PICTURE_LABELS.LogoApp]: "/images/jeexpert-20logo-20inversed.png",
}

/**
 * Returns the URL for a picture by its label. Use this instead of injecting links in code.
 */
export function getPictureUrl(label: PictureLabel): string {
  const url = PICTURE_URLS[label]
  if (!url) {
    throw new Error(`Unknown picture label: ${label}`)
  }
  return url
}
