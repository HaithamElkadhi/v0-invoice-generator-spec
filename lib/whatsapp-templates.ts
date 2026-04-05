/** Phone normalization for wa.me links */
export function phoneToDigits(value: string): string {
  return value.replace(/\D/g, "")
}
