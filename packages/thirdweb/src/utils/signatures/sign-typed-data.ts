import type { TypedData } from "abitype";
import { hashTypedData, type TypedDataDefinition } from "viem";
import type { Hex } from "../encoding/hex.js";
import { sign } from "./sign.js";
import { signatureToHex } from "./signature-to-hex.js";

export type SignTypedDataOptions<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
> = TypedDataDefinition<typedData, primaryType> & {
  privateKey: Hex;
};

export function signTypedData<
  const typedData extends TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | "EIP712Domain",
>(parameters: SignTypedDataOptions<typedData, primaryType>): Hex {
  const { privateKey, ...typedData } =
    parameters as unknown as SignTypedDataOptions;
  const signature = sign({
    hash: hashTypedData(typedData), // TODO: Implement native hashTypedData
    privateKey,
  });
  return signatureToHex(signature);
}
