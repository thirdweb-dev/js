import {
  NET_PUBLIC_DASHBOARD_THIRDWEB_CLIENT_ID,
  NEXT_PUBLIC_IPFS_GATEWAY_URL,
} from "@/constants/public-envs";
import {
  THIRDWEB_BUNDLER_DOMAIN,
  THIRDWEB_INAPP_WALLET_DOMAIN,
  THIRDWEB_INSIGHT_API_DOMAIN,
  THIRDWEB_PAY_DOMAIN,
  THIRDWEB_RPC_DOMAIN,
  THIRDWEB_SOCIAL_API_DOMAIN,
  THIRDWEB_STORAGE_DOMAIN,
} from "constants/urls";
import { type ThirdwebClient, createThirdwebClient } from "thirdweb";
import { populateEip712Transaction } from "thirdweb/transaction";
import {
  getTransactionDecorator,
  setThirdwebDomains,
  setTransactionDecorator,
} from "thirdweb/utils";
import { getZkPaymasterData } from "thirdweb/wallets/smart";
import { getVercelEnv } from "../../lib/vercel-utils";

export function getConfiguredThirdwebClient(options: {
  secretKey: string | undefined;
  teamId: string | undefined;
}): ThirdwebClient {
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
    });
  }

  if (!getTransactionDecorator()) {
    setTransactionDecorator(async ({ account, transaction }) => {
      // special override for sophon testnet (zk chain)
      // sophon only allows transactions through their paymaster
      // so always use eip712 tx + paymaster
      if (transaction.chain.id === 531050104) {
        const serializedTx = await populateEip712Transaction({
          transaction,
          account,
        });
        const pmData = await getZkPaymasterData({
          options: {
            client: transaction.client,
            chain: transaction.chain,
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

  return createThirdwebClient({
    teamId: options.teamId,
    secretKey: options.secretKey,
    clientId: NET_PUBLIC_DASHBOARD_THIRDWEB_CLIENT_ID,
    config: {
      storage: {
        gatewayUrl: NEXT_PUBLIC_IPFS_GATEWAY_URL,
      },
    },
  });
}

/**
 * DO NOT ADD ANYTHING TO THIS FILE IF YOU ARE NOT ABSOLUTELY SURE IT IS OK
 */
