import { hexToNumber, isHex } from "viem";

/**
 * @internal
 */
export function normalizeChainId(chainId: string | number): number {
  if (typeof chainId === "number") {
    return chainId;
  }
  if (isHex(chainId)) {
    return hexToNumber(chainId);
  }
  return parseInt(chainId, 10);
}
