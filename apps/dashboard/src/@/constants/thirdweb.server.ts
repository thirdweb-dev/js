import {
  DASHBOARD_THIRDWEB_CLIENT_ID,
  DASHBOARD_THIRDWEB_SECRET_KEY,
  IPFS_GATEWAY_URL,
} from "@/constants/env";
import {
  THIRDWEB_INAPP_WALLET_DOMAIN,
  THIRDWEB_PAY_DOMAIN,
  THIRDWEB_RPC_DOMAIN,
  THIRDWEB_SOCIAL_API_DOMAIN,
  THIRDWEB_STORAGE_DOMAIN,
} from "constants/urls";
import { createThirdwebClient } from "thirdweb";
import { setThirdwebDomains } from "thirdweb/utils";
import { getVercelEnv } from "../../lib/vercel-utils";

// returns a thirdweb client with optional JWT passed in
export function getThirdwebClient(jwt?: string) {
  if (getVercelEnv() !== "production") {
    // if not on production: run this when creating a client to set the domains
    setThirdwebDomains({
      rpc: THIRDWEB_RPC_DOMAIN,
      inAppWallet: THIRDWEB_INAPP_WALLET_DOMAIN,
      pay: THIRDWEB_PAY_DOMAIN,
      storage: THIRDWEB_STORAGE_DOMAIN,
      social: THIRDWEB_SOCIAL_API_DOMAIN,
    });
  }
  return createThirdwebClient({
    secretKey: jwt ? jwt : DASHBOARD_THIRDWEB_SECRET_KEY,
    clientId: DASHBOARD_THIRDWEB_CLIENT_ID,
    config: {
      storage: {
        gatewayUrl: IPFS_GATEWAY_URL,
      },
    },
  });
}

/**
 * DO NOT ADD ANYTHING TO THIS FILE IF YOU ARE NOT ABSOLUTELY SURE IT IS OK
 */
