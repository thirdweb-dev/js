import { hexToNumber, isHex } from "../../utils/encoding/hex.js";

/**
 * @internal
 */
export function normalizeChainId(chainId: string | number | bigint): number {
  let normalizedChainId: number;

  if (typeof chainId === "number") {
    normalizedChainId = chainId;
  } else if (isHex(chainId)) {
    normalizedChainId = hexToNumber(chainId);
  } else if (typeof chainId === "bigint") {
    if (chainId < 0n || chainId > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new Error(`Invalid chain ID: ${chainId.toString()}`);
    }
    normalizedChainId = Number(chainId);
  } else {
    const trimmed = chainId.trim();
    if (!/^\d+$/u.test(trimmed)) {
      throw new Error(`Invalid chain ID: ${chainId}`);
    }
    normalizedChainId = Number.parseInt(trimmed, 10);
  }

  if (!Number.isSafeInteger(normalizedChainId) || normalizedChainId < 0) {
    throw new Error(`Invalid chain ID: ${chainId.toString()}`);
  }

  return normalizedChainId;
}
