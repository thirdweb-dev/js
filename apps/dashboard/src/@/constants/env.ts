export const DASHBOARD_THIRDWEB_CLIENT_ID =
  process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID || "";

export const DASHBOARD_THIRDWEB_SECRET_KEY =
  process.env.DASHBOARD_SECRET_KEY || "";

export const IPFS_GATEWAY_URL =
  (process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL as string) ||
  "https://{clientId}.ipfscdn.io/ipfs/{cid}/{path}";

export const THIRDWEB_ENGINE_FAUCET_WALLET =
  process.env.NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET || "";
