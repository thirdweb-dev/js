import type { Hex, TransactionSerializable } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import type { ThirdwebClient } from "../client/client.js";
import { defineChain } from "../chains/utils.js";
import { getRpcClient } from "../rpc/rpc.js";
import { eth_sendRawTransaction } from "../rpc/actions/eth_sendRawTransaction.js";
import type { Account } from "./interfaces/wallet.js";

export type PrivateKeyAccountOptions = {
  client: ThirdwebClient;
  privateKey: string;
};

/**
 * Creates a private key wallet.
 * @param options - The options for creating the wallet.
 * @returns An object representing the private key wallet.
 * @wallet
 * @example
 * ```ts
 * import { privateKeyWallet } from "thirdweb/wallets"
 * const wallet = privateKeyWallet({
 *  client,
 *  privateKey: "...",
 * });
 * ```
 */
export function privateKeyAccount(options: PrivateKeyAccountOptions): Account {
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
        chain: defineChain(tx.chainId),
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
  };
  return account;
}
