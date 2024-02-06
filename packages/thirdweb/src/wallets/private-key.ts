import type { Hex, TransactionSerializable } from "viem";
import type { Account } from "./interfaces/wallet.js";
import { privateKeyToAccount } from "viem/accounts";
import type { ThirdwebClient } from "../client/client.js";
import { eth_sendRawTransaction, getRpcClient } from "../rpc/index.js";

export type PrivateKeyAccountOptions = {
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
export function privateKeyAccount(options: PrivateKeyAccountOptions) {
  if (!options.privateKey.startsWith("0x")) {
    options.privateKey = "0x" + options.privateKey;
  }
  const viemAccount = privateKeyToAccount(options.privateKey as Hex);
  const account: Account = {
    address: viemAccount.address,
    sendTransaction: async (
      // TODO: figure out how we would pass our "chain" object in here?
      // maybe we *do* actually have to take in a tx object instead of the raw tx?
      tx: TransactionSerializable & { chainId: number },
    ) => {
      const rpcRequest = getRpcClient({
        client: options.client,
        chain: tx.chainId,
      });
      const signedTx = await viemAccount.signTransaction(tx);
      const transactionHash = await eth_sendRawTransaction(
        rpcRequest,
        signedTx,
      );
      return {
        transactionHash,
      };
    },
    signTransaction: viemAccount.signTransaction,
    signMessage: viemAccount.signMessage,
    signTypedData: viemAccount.signTypedData,
    wallet: {
      connect: async () => account,
      autoConnect: async () => account,
      disconnect: async () => {},
      metadata: {
        name: "Private Key",
        iconUrl: "", // TODO
        id: "private-key",
      },
    },
  };
  return account;
}
