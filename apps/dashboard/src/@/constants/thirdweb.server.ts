import {
  DASHBOARD_THIRDWEB_CLIENT_ID,
  DASHBOARD_THIRDWEB_SECRET_KEY,
  IPFS_GATEWAY_URL,
} from "@/constants/env";
import {
  THIRDWEB_BUNDLER_DOMAIN,
  THIRDWEB_INAPP_WALLET_DOMAIN,
  THIRDWEB_PAY_DOMAIN,
  THIRDWEB_RPC_DOMAIN,
  THIRDWEB_SOCIAL_API_DOMAIN,
  THIRDWEB_STORAGE_DOMAIN,
} from "constants/urls";
import { createThirdwebClient } from "thirdweb";
import { populateEip712Transaction } from "thirdweb/transaction";
import {
  getTransactionDecorator,
  setThirdwebDomains,
  setTransactionDecorator,
} from "thirdweb/utils";
import { getZkPaymasterData } from "thirdweb/wallets/smart";
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
      bundler: THIRDWEB_BUNDLER_DOMAIN,
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
