import { secp256k1 } from "@noble/curves/secp256k1";
import * as ox__Authorization from "ox/Authorization";
import * as ox__Secp256k1 from "ox/Secp256k1";
import type * as ox__TypedData from "ox/TypedData";
import { publicKeyToAddress } from "viem/utils";
import { getCachedChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import { eth_sendRawTransaction } from "../rpc/actions/eth_sendRawTransaction.js";
import { getRpcClient } from "../rpc/rpc.js";
import type { AuthorizationRequest } from "../transaction/actions/eip7702/authorization.js";
import { signTransaction } from "../transaction/actions/sign-transaction.js";
import type { SerializableTransaction } from "../transaction/serialize-transaction.js";
import { getAddress } from "../utils/address.js";
import { type Hex, toHex } from "../utils/encoding/hex.js";
import { signMessage } from "../utils/signatures/sign-message.js";
import { signTypedData } from "../utils/signatures/sign-typed-data.js";
import type { Prettify } from "../utils/type-utils.js";
import type { Account } from "./interfaces/wallet.js";

export type PrivateKeyToAccountOptions = {
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

type Message = Prettify<
  | string
  | {
      raw: Hex | Uint8Array;
    }
>;

/**
 * Get an `Account` object from a private key.
 * @param options - The options for `privateKeyToAccount`
 * Refer to the type [`PrivateKeyToAccountOptions`](https://portal.thirdweb.com/references/typescript/v5/PrivateKeyToAccountOptions)
 * @returns The `Account` object that represents the private key
 * @example
 * ```ts
 * import { privateKeyToAccount } from "thirdweb/wallets"
 *
 * const wallet = privateKeyToAccount({
 *  client,
 *  privateKey: "...",
 * });
 * ```
 * @wallet
 */
export function privateKeyToAccount(
  options: PrivateKeyToAccountOptions,
): Account {
  const { client } = options;
  const privateKey = `0x${options.privateKey.replace(/^0x/, "")}` satisfies Hex;

  const publicKey = toHex(secp256k1.getPublicKey(privateKey.slice(2), false));
  const address = publicKeyToAddress(publicKey);

  const account = {
    address: getAddress(address),
    sendTransaction: async (
      tx: SerializableTransaction & { chainId: number },
    ) => {
      const rpcRequest = getRpcClient({
        chain: getCachedChain(tx.chainId),
        client: client,
      });
      const signedTx = signTransaction({
        privateKey,
        transaction: tx,
      });
      const transactionHash = await eth_sendRawTransaction(
        rpcRequest,
        signedTx,
      );
      return {
        transactionHash,
      };
    },
    signAuthorization: async (authorization: AuthorizationRequest) => {
      const signature = ox__Secp256k1.sign({
        payload: ox__Authorization.getSignPayload(authorization),
        privateKey: privateKey,
      });
      return ox__Authorization.from(authorization, { signature });
    },
    signMessage: async ({ message }: { message: Message }) => {
      return signMessage({
        message,
        privateKey,
      });
    },
    signTransaction: async (tx: SerializableTransaction) => {
      return signTransaction({
        privateKey,
        transaction: tx,
      });
    },
    signTypedData: async <
      const typedData extends ox__TypedData.TypedData | Record<string, unknown>,
      primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
    >(
      _typedData: ox__TypedData.Definition<typedData, primaryType>,
    ) => {
      return signTypedData({
        ..._typedData,
        privateKey,
      });
    },
  };

  return account satisfies Account;
}
