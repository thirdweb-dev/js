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
  const domain = typedData.domain as unknown & { chainId?: unknown }; // TODO: create our own typed data types so this is cleaner
  if (domain?.chainId !== undefined && isHex(domain.chainId)) {
    throw new Error("signTypedData: chainId must be of type number");
  }
  return typedData;
}
