import { ChainId } from "./chains/ChainId";
import { constants } from "ethers";

/**
 * Returns the RoyaltyEngineV1 address for a given chain
 * @param chainId - the chain id
 * @public
 */
export function getRoyaltyEngineV1ByChainId(chainId: number): string {
  return ROYALTY_ENGINE_V1_ADDRESS[chainId] || constants.AddressZero;
}

const ROYALTY_ENGINE_V1_ADDRESS: Record<number, string> = /* @__PURE__ */ {
  [ChainId.Mainnet]: "0x0385603ab55642cb4dd5de3ae9e306809991804f",
  [ChainId.Goerli]: "0xEF770dFb6D5620977213f55f99bfd781D04BBE15",
  [ChainId.BinanceSmartChainMainnet]:
    "0xEF770dFb6D5620977213f55f99bfd781D04BBE15",
  [ChainId.Polygon]: "0x28EdFcF0Be7E86b07493466e7631a213bDe8eEF2",
  [ChainId.Mumbai]: "0x0a01E11887f727D1b1Cd81251eeEE9BEE4262D07",
  [ChainId.Avalanche]: "0xEF770dFb6D5620977213f55f99bfd781D04BBE15",
  [ChainId.Optimism]: "0xEF770dFb6D5620977213f55f99bfd781D04BBE15",
  [ChainId.Arbitrum]: "0xEF770dFb6D5620977213f55f99bfd781D04BBE15",
};
