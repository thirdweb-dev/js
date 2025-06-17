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
import { getVercelEnv } from "@/utils/vercel-utils";
import { type ThirdwebClient, createThirdwebClient } from "thirdweb";
import { setThirdwebDomains } from "thirdweb/utils";

export function getClientDashboardThirdwebClient(): ThirdwebClient {
  if (getVercelEnv() !== "production") {
    // if not on production: run this when creating a client to set the domains
    setThirdwebDomains({
      rpc: THIRDWEB_RPC_DOMAIN,
      inAppWallet: THIRDWEB_INAPP_WALLET_DOMAIN,
      pay: THIRDWEB_PAY_DOMAIN,
      storage: THIRDWEB_STORAGE_DOMAIN,
      social: THIRDWEB_SOCIAL_API_DOMAIN,
      bundler: THIRDWEB_BUNDLER_DOMAIN,
      insight: THIRDWEB_INSIGHT_API_DOMAIN,
      bridge: THIRDWEB_BRIDGE_URL,
    });
  }

  return createThirdwebClient({
    clientId: NEXT_PUBLIC_DASHBOARD_CLIENT_ID,
    config: {
      storage: {
        gatewayUrl: NEXT_PUBLIC_IPFS_GATEWAY_URL,
      },
    },
  });
}
