import { DASHBOARD_THIRDWEB_CLIENT_ID } from "constants/rpc";
import { createThirdwebClient } from "thirdweb";

// use env var to set IPFS gateway or fallback to ipfscdn.io
const IPFS_GATEWAY_URL =
  (process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL as string) ||
  "https://{clientId}.ipfscdn.io/ipfs/{cid}/{path}";

export const thirdwebClient = createThirdwebClient({
  clientId: DASHBOARD_THIRDWEB_CLIENT_ID,
  config: {
    storage: {
      gatewayUrl: IPFS_GATEWAY_URL,
    },
  },
});

/**
 * DO NOT ADD ANYTHING TO THIS FILE IF YOU ARE NOT ABSOLUTELY SURE IT IS OK
 */
