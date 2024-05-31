import type { TypedData } from "abitype";
import { type TypedDataDefinition, hashTypedData } from "viem";
import type { Hex } from "../encoding/hex.js";
import { parseTypedData } from "./helpers/parseTypedData.js";
import { sign } from "./sign.js";
import { signatureToHex } from "./signature-to-hex.js";

export type SignTypedDataOptions<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
> = TypedDataDefinition<typedData, primaryType> & {
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
  const typedData extends TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | "EIP712Domain",
>(options: SignTypedDataOptions<typedData, primaryType>): Hex {
  const { privateKey, ...typedData } =
    options as unknown as SignTypedDataOptions;

  const parsedTypeData = parseTypedData(typedData);

  const signature = sign({
    hash: hashTypedData(parsedTypeData), // TODO: Implement native hashTypedData
    privateKey,
  });
  return signatureToHex(signature);
}
