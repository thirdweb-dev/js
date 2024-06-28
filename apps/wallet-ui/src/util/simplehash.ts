export const SIMPLEHASH_SUPPORTED_CHAIN_IDS = [
  1, 5, 10, 137, 288, 42161, 80001,
];
export function chainIdToName(chainId: number) {
  switch (chainId) {
    case 1:
      return "ethereum";
    case 137:
      return "polygon";
    default:
      throw new Error(`Unknown chain id: ${chainId}`);
  }
}
