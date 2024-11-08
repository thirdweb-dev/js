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
import { getChainMetadata } from "thirdweb/chains";
import { populateEip712Transaction } from "thirdweb/transaction";
import {
  getTransactionDecorator,
  isZkSyncChain,
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
      // use paymaster for zk chains on testnets
      const chainMeta = await getChainMetadata(transaction.chain);
      if (chainMeta.testnet) {
        const isZkChain = await isZkSyncChain(transaction.chain);
        if (isZkChain) {
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
          }).catch((e) => {
            console.warn(
              "No zk paymaster data available on chain ",
              transaction.chain.id,
              e,
            );
            return undefined;
          });
          return {
            account,
            transaction: {
              ...transaction,
              eip712: pmData
                ? {
                    ...transaction.eip712,
                    paymaster: pmData.paymaster,
                    paymasterInput: pmData.paymasterInput,
                  }
                : transaction.eip712,
            },
          };
        }
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
