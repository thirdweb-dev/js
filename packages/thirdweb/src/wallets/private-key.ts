import type {
  HDAccount,
  PrivateKeyAccount,
  Hex,
  TransactionSerializable,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import type { ThirdwebClient } from "../client/client.js";
import { defineChain } from "../chains/utils.js";
import { getRpcClient } from "../rpc/rpc.js";
import { eth_sendRawTransaction } from "../rpc/actions/eth_sendRawTransaction.js";
import type { Account } from "./interfaces/wallet.js";

export type PrivateKeyAccountOptions = {
  /**
   * A client is the entry point to the thirdweb SDK.
   * It is required for all other actions.
   * You can create a client using the `createThirdwebClient` function. Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   * You must provide a `clientId` or `secretKey` in order to initialize a client. Pass `clientId` if you want for client-side usage and `secretKey` for server-side usage.
   *
   * ```tsx
   * import { createThirdwebClient } from "thirdweb";
   *
   * const client = createThirdwebClient({
   *  clientId: "<your_client_id>",
   * })
   * ```
   */
  client: ThirdwebClient;

  /**
   * The private key to use for the account.
   *
   * Do not commit private key in your code and use environment variables or other secure methods to store the private key.
   * @example
   * ```ts
   * const privateKey = process.env.PRIVATE_KEY;
   * ```
   */
  privateKey: string;
};

/**
 * Get an `Account` object from a private key.
 * @param options - The options for `privateKeyAccount`
 * Refer to the type [`PrivateKeyAccountOptions`](https://portal.thirdweb.com/references/typescript/v5/PrivateKeyAccountOptions)
 * @returns The `Account` object that represents the private key
 * @example
 * ```ts
 * import { privateKeyAccount } from "thirdweb/wallets"
 *
 * const wallet = privateKeyAccount({
 *  client,
 *  privateKey: "...",
 * });
 * ```
 * @wallet
 */
export function privateKeyAccount(options: PrivateKeyAccountOptions): Account {
  if (!options.privateKey.startsWith("0x")) {
    options.privateKey = "0x" + options.privateKey;
  }
  const viemAccount = privateKeyToAccount(options.privateKey as Hex);
  return viemToThirdwebAccount(viemAccount, options.client);
}

export type MnemonicAccountOptions = {
  /**
   * A client is the entry point to the thirdweb SDK.
   * It is required for all other actions.
   * You can create a client using the `createThirdwebClient` function. Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   * You must provide a `clientId` or `secretKey` in order to initialize a client. Pass `clientId` if you want for client-side usage and `secretKey` for server-side usage.
   *
   * ```tsx
   * import { createThirdwebClient } from "thirdweb";
   *
   * const client = createThirdwebClient({
   *  clientId: "<your_client_id>",
   * })
   * ```
   */
  client: ThirdwebClient;

  /**
   * The mnemonic to use for the account.
   */
  mnemonic: string;
};

/**
 * @internal
 */
export function viemToThirdwebAccount(
  viemAccount: HDAccount | PrivateKeyAccount,
  client: ThirdwebClient,
) {
  const account: Account = {
    address: viemAccount.address,
    sendTransaction: async (
      // TODO: figure out how we would pass our "chain" object in here?
      // maybe we *do* actually have to take in a tx object instead of the raw tx?
      tx: TransactionSerializable & { chainId: number },
    ) => {
      const rpcRequest = getRpcClient({
        client: client,
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
