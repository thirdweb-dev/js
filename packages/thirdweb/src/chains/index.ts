// chain type
export type { Chain } from "./types.js";
// define chain
export { defineChain } from "./utils.js";

/**
 * PRE_DEFINED CHAINS
 */
export { arbitrumSepolia } from "./chain-definitions/arbitrum-sepolia.js";
export { arbitrum } from "./chain-definitions/arbitrum.js";
export { avalancheFuji } from "./chain-definitions/avalanche-fuji.js";
export { avalanche } from "./chain-definitions/avalanche.js";
export { baseSepolia } from "./chain-definitions/base-sepolia.js";
export { base } from "./chain-definitions/base.js";
// mainnet = alias for ethereum
export { ethereum, mainnet } from "./chain-definitions/ethereum.js";
export { optimismSepolia } from "./chain-definitions/optimism-sepolia.js";
export { optimism } from "./chain-definitions/optimism.js";
// mumbai = alias for polygonMumbai
export { polygonMumbai, mumbai } from "./chain-definitions/polygon-mumbai.js";
export { polygon } from "./chain-definitions/polygon.js";
export { sepolia } from "./chain-definitions/sepolia.js";
export { zoraSepolia } from "./chain-definitions/zora-sepolia.js";
export { zora } from "./chain-definitions/zora.js";
