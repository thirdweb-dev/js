import { createThirdwebClient, type ThirdwebClient } from "thirdweb";
import { populateEip712Transaction } from "thirdweb/transaction";
import {
  getTransactionDecorator,
  setThirdwebDomains,
  setTransactionDecorator,
} from "thirdweb/utils";
import { getZkPaymasterData } from "thirdweb/wallets/smart";
import {
  NEXT_PUBLIC_DASHBOARD_CLIENT_ID,
  NEXT_PUBLIC_IPFS_GATEWAY_URL,
} from "@/constants/public-envs";
import {
  THIRDWEB_BRIDGE_URL,
  THIRDWEB_BUNDLER_DOMAIN,
  THIRDWEB_ENGINE_CLOUD_URL,
  THIRDWEB_INAPP_WALLET_DOMAIN,
  THIRDWEB_INSIGHT_API_DOMAIN,
  THIRDWEB_PAY_DOMAIN,
  THIRDWEB_RPC_DOMAIN,
  THIRDWEB_SOCIAL_API_DOMAIN,
  THIRDWEB_STORAGE_DOMAIN,
} from "@/constants/urls";
import { getVercelEnv } from "@/utils/vercel";

export function getConfiguredThirdwebClient(options: {
  secretKey: string | undefined;
  teamId: string | undefined;
  clientId?: string;
}): ThirdwebClient {
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
      engineCloud: new URL(THIRDWEB_ENGINE_CLOUD_URL).hostname,
    });
  }

  if (!getTransactionDecorator()) {
    setTransactionDecorator(async ({ account, transaction }) => {
      // special override for sophon (zk chain)
      // sophon only allows transactions through their paymaster
      // so always use eip712 tx + paymaster
      if (
        transaction.chain.id === 531050104 ||
        transaction.chain.id === 50104
      ) {
        const serializedTx = await populateEip712Transaction({
          account,
          transaction,
        });
        const pmData = await getZkPaymasterData({
          options: {
            chain: transaction.chain,
            client: transaction.client,
          },
          transaction: serializedTx,
        });
        return {
          account,
          transaction: {
            ...transaction,
            eip712: {
              ...transaction.eip712,
              paymaster: pmData.paymaster,
              paymasterInput: pmData.paymasterInput,
            },
          },
        };
      }
      return { account, transaction };
    });
  }

  // During build time, provide fallbacks if credentials are missing
  const clientId =
    options.clientId || NEXT_PUBLIC_DASHBOARD_CLIENT_ID || "dummy-build-client";
  const secretKey = options.secretKey || undefined;

  return createThirdwebClient({
    clientId: clientId,
    config: {
      storage: {
        gatewayUrl: NEXT_PUBLIC_IPFS_GATEWAY_URL,
      },
    },
    secretKey: secretKey,
    teamId: options.teamId,
  });
}

/**
 * DO NOT ADD ANYTHING TO THIS FILE IF YOU ARE NOT ABSOLUTELY SURE IT IS OK
 */
