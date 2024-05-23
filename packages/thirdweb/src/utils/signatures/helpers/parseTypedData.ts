import type { TypedData } from "abitype";
import type { TypedDataDefinition } from "viem";
import { isHex } from "../../encoding/hex.js";

/**
 * @internal
 */
export function parseTypedData<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
>(
  typedData: TypedDataDefinition<typedData, primaryType>,
): TypedDataDefinition<typedData, primaryType> {
  if (isHex(typedData.domain?.chainId)) {
    throw new Error("signTypedData: chainId must be of type number");
  }
  return typedData;
}
