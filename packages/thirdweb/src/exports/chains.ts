// chain types
export type { Chain, ChainOptions, ChainMetadata } from "../chains/types.js";
// define chain, chainMetadata
export {
  defineChain,
  getChainMetadata,
  getRpcUrlForChain,
} from "../chains/utils.js";

/**
 * PRE_DEFINED CHAINS
 */
export { anvil } from "../chains/chain-definitions/anvil.js";
export { hardhat } from "../chains/chain-definitions/hardhat.js";
export { arbitrumNova } from "../chains/chain-definitions/arbitrum-nova.js";
export { arbitrumSepolia } from "../chains/chain-definitions/arbitrum-sepolia.js";
export { arbitrum } from "../chains/chain-definitions/arbitrum.js";
export { avalancheFuji } from "../chains/chain-definitions/avalanche-fuji.js";
export { avalanche } from "../chains/chain-definitions/avalanche.js";
export { baseSepolia } from "../chains/chain-definitions/base-sepolia.js";
export { base } from "../chains/chain-definitions/base.js";
// mainnet = alias for ethereum
export { ethereum, mainnet } from "../chains/chain-definitions/ethereum.js";
export { optimismSepolia } from "../chains/chain-definitions/optimism-sepolia.js";
export { optimism } from "../chains/chain-definitions/optimism.js";
// mumbai = alias for polygonMumbai
export {
  polygonMumbai,
  mumbai,
} from "../chains/chain-definitions/polygon-mumbai.js";
export { polygonAmoy } from "../chains/chain-definitions/polygon-amoy.js";
export { polygon } from "../chains/chain-definitions/polygon.js";
export { sepolia } from "../chains/chain-definitions/sepolia.js";
export { zoraSepolia } from "../chains/chain-definitions/zora-sepolia.js";
export { zora } from "../chains/chain-definitions/zora.js";
export { bsc } from "../chains/chain-definitions/bsc.js";
export { bscTestnet } from "../chains/chain-definitions/bsc-testnet.js";
export { zkSync } from "../chains/chain-definitions/zksync.js";
export { zkSyncSepolia } from "../chains/chain-definitions/zksync-sepolia.js";
