import type { Hex, TransactionSerializable } from "viem";
import type { ThirdwebClient } from "../client/client.js";

import type { Wallet } from "./interfaces/wallet.js";
import { eth_sendRawTransaction, getRpcClient } from "../rpc/index.js";
import { privateKeyToAccount } from "viem/accounts";

export type PrivateKeyWalletOptions = {
  client: ThirdwebClient;
  privateKey: string;
};

/**
 * Creates a private key wallet.
 * @param options - The options for creating the wallet.
 * @returns An object representing the private key wallet.
 * @example
 * ```ts
 * import { privateKeyWallet } from "thirdweb/wallets"
 * const wallet = privateKeyWallet({
 *  client,
 *  privateKey: "...",
 * });
 * ```
 */
export function privateKeyWallet(options: PrivateKeyWalletOptions) {
  if (!options.privateKey.startsWith("0x")) {
    options.privateKey = "0x" + options.privateKey;
  }
  const account = privateKeyToAccount(options.privateKey as Hex);
  return {
    address: account.address,
    sendTransaction: async (
      // TODO: figure out how we would pass our "chain" object in here?
      // maybe we *do* actually have to take in a tx object instead of the raw tx?
      tx: TransactionSerializable & { chainId: number },
    ) => {
      const rpcRequest = getRpcClient({
        client: options.client,
        chain: tx.chainId,
      });
      const signedTx = await account.signTransaction(tx);
      const transactionHash = await eth_sendRawTransaction(
        rpcRequest,
        signedTx,
      );
      return {
        transactionHash,
      };
    },
    signTransaction: account.signTransaction,
    signMessage: account.signMessage,
    signTypedData: account.signTypedData,
    id: "private-key",
  } satisfies Wallet;
}
