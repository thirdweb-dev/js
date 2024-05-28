import type { TypedData } from "abitype";
import type { TypedDataDefinition } from "viem";
import { type Hex, hexToNumber, isHex } from "../../encoding/hex.js";

type UnknownDomain = unknown & { chainId?: unknown }; // TODO: create our own typed data types so this is cleaner
type HexDomain = unknown & { chainId: Hex }; // TODO: create our own typed data types so this is cleaner

/**
 * @internal
 */
export function parseTypedData<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
>(
  typedData: TypedDataDefinition<typedData, primaryType>,
): TypedDataDefinition<typedData, primaryType> {
  const domain = typedData.domain as UnknownDomain;
  if (domain?.chainId !== undefined && isHex(domain.chainId)) {
    typedData.domain = {
      ...(typedData.domain as HexDomain),
      chainId: hexToNumber((typedData.domain as unknown as HexDomain).chainId),
    } as unknown as TypedDataDefinition<typedData, primaryType>["domain"];
  }
  return typedData;
}
