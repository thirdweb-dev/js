export const DASHBOARD_THIRDWEB_CLIENT_ID =
  process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID || "";

export const DASHBOARD_THIRDWEB_SECRET_KEY =
  process.env.DASHBOARD_SECRET_KEY || "";

export const IPFS_GATEWAY_URL =
  (process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL as string) ||
  "https://{clientId}.ipfscdn.io/ipfs/{cid}/{path}";

export const isProd =
  (process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV) ===
  "production";

export const PROD_OR_DEV_URL = isProd ? "thirdweb.com" : "thirdweb-dev.com";

export const DASHBOARD_STORAGE_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_UPLOAD_SERVER ||
  "https://storage.thirdweb.com";

export const API_SERVER_URL =
  process.env.NEXT_PUBLIC_THIRDWEB_API_HOST || "https://api.thirdweb.com";

/**
 * Faucet stuff
 */
// Cloudflare Turnstile Site key
export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
export const THIRDWEB_ENGINE_FAUCET_WALLET =
  process.env.NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET || "";
export const THIRDWEB_ENGINE_URL = process.env.THIRDWEB_ENGINE_URL;
export const THIRDWEB_ACCESS_TOKEN = process.env.THIRDWEB_ACCESS_TOKEN;
// Comma-separated list of chain IDs to disable faucet for.
export const DISABLE_FAUCET_CHAIN_IDS = process.env.DISABLE_FAUCET_CHAIN_IDS;

export const BASE_URL = isProd
  ? "https://thirdweb.com"
  : (process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
      : "http://localhost:3000") || "https://thirdweb-dev.com";
