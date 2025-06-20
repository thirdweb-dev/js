import type { Account } from "viem/accounts";

import type { Chain } from "../../chains/types.js";
import { getCachedChain } from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { estimateGas } from "../../transaction/actions/estimate-gas.js";
import { sendTransaction } from "../../transaction/actions/send-transaction.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import { hexToNumber, isHex } from "../../utils/encoding/hex.js";
import type { Wallet } from "../../wallets/interfaces/wallet.js";
import type { EIP1193Provider } from "./types.js";

export type ToEip1193ProviderOptions = {
  wallet: Wallet;
  chain: Chain;
  client: ThirdwebClient;
  connectOverride?: (wallet: Wallet) => Promise<Account>;
};

/**
 * Converts a Thirdweb wallet into an EIP-1193 compatible provider.
 *
 * This adapter allows you to use a Thirdweb wallet with any library or dApp that expects an EIP-1193 provider.
 * The provider implements the standard EIP-1193 interface including request handling and event subscription.
 *
 * @param options - Configuration options for creating the provider
 * @param options.wallet - The Thirdweb wallet to adapt into a provider
 * @param options.chain - The blockchain chain to connect to
 * @param options.client - The Thirdweb client instance
 * @param options.connectOverride - Optional custom connect handler to override default connection behavior
 * @returns An EIP-1193 compatible provider that wraps the Thirdweb wallet
 *
 * @example
 * ```ts
 * import { EIP1193 } from "thirdweb/wallets";
 *
 * // Create an EIP-1193 provider from a Thirdweb wallet
 * const provider = EIP1193.toProvider({
 *   wallet,
 *   chain: ethereum,
 *   client: createThirdwebClient({ clientId: "..." })
 * });
 *
 * // Use with any EIP-1193 compatible library
 * const accounts = await provider.request({
 *   method: "eth_requestAccounts"
 * });
 *
 * // Listen for events
 * provider.on("accountsChanged", (accounts) => {
 *   console.log("Active accounts:", accounts);
 * });
 * ```
 *
 * @extension EIP1193
 */
export function toProvider(options: ToEip1193ProviderOptions): EIP1193Provider {
  const { chain, client, wallet, connectOverride } = options;
  const rpcClient = getRpcClient({ chain, client });
  return {
    on: wallet.subscribe,
    removeListener: () => {
      // should invoke the return fn from subscribe instead
    },
    request: async (request) => {
      if (request.method === "eth_sendTransaction") {
        const account = wallet.getAccount();
        if (!account) {
          throw new Error("Account not connected");
        }
        const result = await sendTransaction({
          account: account,
          transaction: prepareTransaction({
            ...request.params[0],
            chain,
            client,
          }),
        });
        return result.transactionHash;
      }
      if (request.method === "eth_estimateGas") {
        const account = wallet.getAccount();
        if (!account) {
          throw new Error("Account not connected");
        }
        return estimateGas({
          account,
          transaction: prepareTransaction({
            ...request.params[0],
            chain,
            client,
          }),
        });
      }
      if (request.method === "personal_sign") {
        const account = wallet.getAccount();
        if (!account) {
          throw new Error("Account not connected");
        }
        return account.signMessage({
          message: {
            raw: request.params[0],
          },
        });
      }
      if (request.method === "eth_signTypedData_v4") {
        const account = wallet.getAccount();
        if (!account) {
          throw new Error("Account not connected");
        }
        const data = JSON.parse(request.params[1]);
        return account.signTypedData(data);
      }
      if (request.method === "eth_accounts") {
        const account = wallet.getAccount();
        if (!account) {
          throw new Error("Account not connected");
        }
        return [account.address];
      }
      if (request.method === "eth_requestAccounts") {
        const account = connectOverride
          ? await connectOverride(wallet)
          : await wallet.connect({
              client,
            });
        if (!account) {
          throw new Error("Unable to connect wallet");
        }
        return [account.address];
      }
      if (
        request.method === "wallet_switchEthereumChain" ||
        request.method === "wallet_addEthereumChain"
      ) {
        const data = request.params[0];
        const chainIdHex = data.chainId;
        if (!chainIdHex) {
          throw new Error("Chain ID is required");
        }
        // chainId is hex most likely, convert to number
        const chainId = isHex(chainIdHex)
          ? hexToNumber(chainIdHex)
          : chainIdHex;
        const chain = getCachedChain(chainId);
        return wallet.switchChain(chain);
      }
      return rpcClient(request);
    },
  };
}
