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
  // I know, I'm sorry, this type is whack so we're gonna use unknown for now
  if (
    isHex(
      (typedData.domain as unknown as { chainId: unknown } | undefined)
        ?.chainId,
    )
  ) {
    throw new Error("signTypedData: chainId must be of type number");
  }
  return typedData;
}
