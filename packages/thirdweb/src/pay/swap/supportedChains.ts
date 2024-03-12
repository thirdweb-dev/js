// Ethereum, Optimism, Polygon
export const swapSupportedChains = [10, 137] as const;

export type SwapSupportedChainId = (typeof swapSupportedChains)[number];
