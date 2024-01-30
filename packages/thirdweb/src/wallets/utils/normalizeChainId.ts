/**
 * @internal
 */
export function normalizeChainId(chainId: string | number | bigint) {
  // always want a bigint in the end and it already handles
  // hex
  // integer
  // bigint
  return BigInt(chainId);
}
