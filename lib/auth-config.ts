/** Defaults match product login; override with NEXT_PUBLIC_AUTH_USER / NEXT_PUBLIC_AUTH_PASSWORD if needed */
export const AUTH_CONFIG = {
  username: process.env.NEXT_PUBLIC_AUTH_USER ?? "admin",
  password: process.env.NEXT_PUBLIC_AUTH_PASSWORD ?? "Jeexpert!",
} as const
