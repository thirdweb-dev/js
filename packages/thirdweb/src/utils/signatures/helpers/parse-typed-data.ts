import * as ox__Hex from "ox/Hex";
import type * as ox__TypedData from "ox/TypedData";
import type { Hex } from "../../encoding/hex.js";

type UnknownDomain = unknown & { chainId?: unknown };
type HexDomain = unknown & { chainId: Hex };

/**
 * @internal
 */
export function parseTypedData<
  typedData extends
    | ox__TypedData.TypedData
    | Record<string, unknown> = ox__TypedData.TypedData,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
>(
  typedData: ox__TypedData.Definition<typedData, primaryType>,
): ox__TypedData.Definition<typedData, primaryType> {
  const domain = typedData.domain as UnknownDomain;
  if (domain?.chainId !== undefined && ox__Hex.validate(domain.chainId)) {
    typedData.domain = {
      ...(typedData.domain as HexDomain),
      chainId: ox__Hex.toNumber(
        (typedData.domain as unknown as HexDomain).chainId,
      ),
    } as unknown as ox__TypedData.Definition<typedData, primaryType>["domain"];
  }
  return typedData;
}
