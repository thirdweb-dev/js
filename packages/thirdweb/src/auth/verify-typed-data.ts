import type * as ox__Signature from "ox/Signature";
import * as ox__TypedData from "ox/TypedData";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import type { Hex } from "../utils/encoding/hex.js";
import type { HashTypedDataParams } from "../utils/hashing/hashTypedData.js";
import { type VerifyHashParams, verifyHash } from "./verify-hash.js";

export type VerifyTypedDataParams<
  typedData extends
    | ox__TypedData.TypedData
    | Record<string, unknown> = ox__TypedData.TypedData,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
> = Omit<VerifyHashParams, "hash"> &
  ox__TypedData.Definition<typedData, primaryType> & {
    address: string;
    signature: string | Uint8Array | ox__Signature.Signature;
    client: ThirdwebClient;
    chain: Chain;
    accountFactory?: {
      address: string;
      verificationCalldata: Hex;
    };
  };

/**
 * Verify am [EIP-712](https://eips.ethereum.org/EIPS/eip-712) typed data signature. This function is interoperable with all wallet types (smart accounts or EOAs).
 *
 * @param {string} options.address The address that signed the typed data
 * @param {string | Uint8Array | Signature} options.signature The signature that was signed
 * @param {ThirdwebClient} options.client The Thirdweb client
 * @param {Chain} options.chain The chain that the address is on. For an EOA, this can be any chain.
 * @param {string} [options.accountFactory.address] The address of the account factory that created the account if using a smart account with a custom account factory
 * @param {Hex} [options.accountFactory.verificationCalldata] The calldata that was used to create the account if using a smart account with a custom account factory
 * @param {typeof VerifyTypedDataParams.message} options.message The EIP-712 message that was signed.
 * @param {typeof VerifyTypedDataParams.domain} options.domain The EIP-712 domain that was signed.
 * @param {typeof VerifyTypedDataParams.primaryType} options.primaryType The EIP-712 primary type that was signed.
 * @param {typeof VerifyTypedDataParams.types} options.types The EIP-712 types that were signed.
 *
 * @returns {Promise<boolean>} A promise that resolves to `true` if the signature is valid, or `false` otherwise.
 *
 * @example
 * ```ts
 * import { verifyTypedData } from "thirdweb/utils";
 * const isValid = await verifyTypedData({
 *   address: "0x...",
 *   signature: "0x...",
 *   client,
 *   chain,
 *   domain: {
      name: "Ether Mail",
      version: "1",
      chainId: 1,
      verifyingContract: "0x0000000000000000000000000000000000000000",
    },
 *   primaryType: "Mail",
 *   types: {
      Person: [
        { name: "name", type: "string" },
        { name: "wallet", type: "address" },
      ],
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person" },
        { name: "contents", type: "string" },
      ],
    },
    message: {
      from: {
        name: "Cow",
        wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
      },
      to: {
        name: "Bob",
        wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      },
      contents: "Hello, Bob!",
    },
 * });
 * ```
 *
 * @auth
 */
export async function verifyTypedData<
  typedData extends ox__TypedData.TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | "EIP712Domain",
>({
  address,
  signature,
  client,
  chain,
  accountFactory,
  message,
  domain,
  primaryType,
  types,
}: VerifyTypedDataParams<typedData, primaryType>): Promise<boolean> {
  const messageHash = ox__TypedData.getSignPayload({
    domain,
    message,
    primaryType,
    types,
  } as HashTypedDataParams);
  return verifyHash({
    accountFactory,
    address,
    chain,
    client,
    hash: messageHash,
    signature,
  });
}
