export const isProd =
  (process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV) ===
  "production";

export const PROD_OR_DEV_URL = isProd ? "thirdweb.com" : "thirdweb-dev.com";

export const BASE_URL = isProd
  ? "https://thirdweb.com"
  : (process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
      : "http://localhost:3000") || "https://thirdweb-dev.com";
