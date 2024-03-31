export const DASHBOARD_THIRDWEB_CLIENT_ID =
  process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID || "";

export const DASHBOARD_THIRDWEB_SECRET_KEY =
  process.env.DASHBOARD_SECRET_KEY || "";

export const isProd =
  (process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV) ===
  "production";

export const PROD_OR_DEV_URL = isProd ? "thirdweb.com" : "thirdweb-dev.com";
