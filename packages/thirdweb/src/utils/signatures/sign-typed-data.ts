import * as ox__Hex from "ox/Hex";
import * as ox__Secp256k1 from "ox/Secp256k1";
import * as ox__Signature from "ox/Signature";
import * as ox__TypedData from "ox/TypedData";
import type { Hex } from "../encoding/hex.js";

export type SignTypedDataOptions<
  typedData extends
    | ox__TypedData.TypedData
    | Record<string, unknown> = ox__TypedData.TypedData,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
> = ox__TypedData.Definition<typedData, primaryType> & {
  privateKey: Hex;
};

/**
 * Signs a typed data object with a given private key according to EIP712.
 * @param options The typed data is passed within options alongside the private key
 * @param options.privateKey The private key to sign the typed data with
 * @returns The signature as a hex string
 * @example
 * ```ts
 * import { signTypedData } from "thirdweb/utils";
 * signTypedData({
 *   privateKey: "0x...",
 *   ...typedData
 * });
 * ```
 * @utils
 */
export function signTypedData<
  const typedData extends ox__TypedData.TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | "EIP712Domain",
>(options: SignTypedDataOptions<typedData, primaryType>): Hex {
  const { privateKey, ...typedData } =
    options as unknown as SignTypedDataOptions;

  if (typeof typedData.domain?.chainId === "string") {
    typedData.domain.chainId = ox__Hex.toNumber(typedData.domain.chainId);
  }

  const payload = ox__TypedData.getSignPayload(typedData);

  const signature = ox__Secp256k1.sign({
    payload,
    privateKey,
  });

  return ox__Signature.toHex(signature);
}
