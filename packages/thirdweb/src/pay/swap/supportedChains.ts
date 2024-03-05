// Ethereum, Optimism, Polygon
export const swapSupportedChains = [1, 10, 137] as const;

export type SwapSupportedChainId = (typeof swapSupportedChains)[number];
