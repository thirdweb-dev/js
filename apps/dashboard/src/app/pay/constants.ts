import { createThirdwebClient } from "thirdweb";
import { setThirdwebDomains } from "thirdweb/utils";
import {
  NEXT_PUBLIC_DASHBOARD_CLIENT_ID,
  NEXT_PUBLIC_IPFS_GATEWAY_URL,
} from "@/constants/public-envs";
import {
  THIRDWEB_BRIDGE_URL,
  THIRDWEB_BUNDLER_DOMAIN,
  THIRDWEB_INAPP_WALLET_DOMAIN,
  THIRDWEB_INSIGHT_API_DOMAIN,
  THIRDWEB_PAY_DOMAIN,
  THIRDWEB_RPC_DOMAIN,
  THIRDWEB_SOCIAL_API_DOMAIN,
  THIRDWEB_STORAGE_DOMAIN,
} from "@/constants/urls";
import { getVercelEnv } from "@/utils/vercel";

function getPayThirdwebClient() {
  if (getVercelEnv() !== "production") {
    // if not on production: run this when creating a client to set the domains
    setThirdwebDomains({
      bridge: THIRDWEB_BRIDGE_URL,
      bundler: THIRDWEB_BUNDLER_DOMAIN,
      inAppWallet: THIRDWEB_INAPP_WALLET_DOMAIN,
      insight: THIRDWEB_INSIGHT_API_DOMAIN,
      pay: THIRDWEB_PAY_DOMAIN,
      rpc: THIRDWEB_RPC_DOMAIN,
      social: THIRDWEB_SOCIAL_API_DOMAIN,
      storage: THIRDWEB_STORAGE_DOMAIN,
    });
  }

  return createThirdwebClient({
    clientId: NEXT_PUBLIC_DASHBOARD_CLIENT_ID,
    config: {
      storage: {
        gatewayUrl: NEXT_PUBLIC_IPFS_GATEWAY_URL,
      },
    },
    secretKey: undefined,
  });
}

export const payAppThirdwebClient = getPayThirdwebClient();
