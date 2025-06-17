export const NEXT_PUBLIC_DASHBOARD_CLIENT_ID =
  process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID || "";

export const NEXT_PUBLIC_NEBULA_APP_CLIENT_ID =
  process.env.NEXT_PUBLIC_NEBULA_APP_CLIENT_ID || "";

export const NEXT_PUBLIC_IPFS_GATEWAY_URL =
  (process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL as string) ||
  "https://{clientId}.ipfscdn.io/ipfs/{cid}/{path}";

export const NEXT_PUBLIC_TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

export const NEXT_PUBLIC_NEBULA_URL = process.env.NEXT_PUBLIC_NEBULA_URL || "";
