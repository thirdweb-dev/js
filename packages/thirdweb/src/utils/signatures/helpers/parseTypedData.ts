import type { TypedData } from "abitype";
import type { TypedDataDefinition } from "viem";
import { type Hex, hexToNumber, isHex } from "../../encoding/hex.js";

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
    typedData.domain = {
      ...typedData.domain,
      chainId: hexToNumber(typedData.domain?.chainId as unknown as Hex),
    } as unknown as TypedDataDefinition<typedData, primaryType>["domain"];
  }
  return typedData;
}
