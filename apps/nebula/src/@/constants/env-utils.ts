export const isProd =
  (process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV) ===
  "production";
