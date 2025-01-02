import { hexToNumber, isHex } from "../../utils/encoding/hex.js";

/**
 * @internal
 */
export function normalizeChainId(chainId: string | number | bigint): number {
  if (typeof chainId === "number") {
    return chainId;
  }
  if (isHex(chainId)) {
    return hexToNumber(chainId);
  }
  if (typeof chainId === "bigint") {
    return Number(chainId);
  }
  return Number.parseInt(chainId, 10);
}
