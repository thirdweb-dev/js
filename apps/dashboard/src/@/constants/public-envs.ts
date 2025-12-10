export const NEXT_PUBLIC_DASHBOARD_CLIENT_ID =
  process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID || "";

export const NEXT_PUBLIC_THIRDWEB_VAULT_URL =
  process.env.NEXT_PUBLIC_THIRDWEB_VAULT_URL || "";

export const NEXT_PUBLIC_ENGINE_CLOUD_URL =
  process.env.NEXT_PUBLIC_ENGINE_CLOUD_URL || "";

export const NEXT_PUBLIC_IPFS_GATEWAY_URL =
  (process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL as string) ||
  "https://{clientId}.ipfscdn.io/ipfs/{cid}/{path}";

export const NEXT_PUBLIC_DASHBOARD_UPLOAD_SERVER =
  process.env.NEXT_PUBLIC_DASHBOARD_UPLOAD_SERVER ||
  "https://storage.thirdweb.com";

export const NEXT_PUBLIC_THIRDWEB_API_HOST =
  process.env.NEXT_PUBLIC_THIRDWEB_API_HOST || "https://api.thirdweb.com";

export const NEXT_PUBLIC_THIRDWEB_BRIDGE_HOST =
  process.env.NEXT_PUBLIC_THIRDWEB_BRIDGE_HOST || "https://bridge.thirdweb.com";

export const NEXT_PUBLIC_TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

export const NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET =
  process.env.NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET || "";

export const NEXT_PUBLIC_DEMO_ENGINE_URL =
  process.env.NEXT_PUBLIC_DEMO_ENGINE_URL || "";

export const NEXT_PUBLIC_THIRDWEB_AI_HOST =
  process.env.NEXT_PUBLIC_THIRDWEB_AI_HOST || "https://nebula-api.thirdweb.com";

export const NEXT_PUBLIC_BRIDGE_PAGE_CLIENT_ID =
  process.env.NEXT_PUBLIC_BRIDGE_PAGE_CLIENT_ID;

export const NEXT_PUBLIC_CHAIN_PAGE_CLIENT_ID =
  process.env.NEXT_PUBLIC_CHAIN_PAGE_CLIENT_ID;

export const NEXT_PUBLIC_ASSET_PAGE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ASSET_PAGE_CLIENT_ID;

export const NEXT_PUBLIC_BRIDGE_IFRAME_CLIENT_ID =
  process.env.NEXT_PUBLIC_BRIDGE_IFRAME_CLIENT_ID;
