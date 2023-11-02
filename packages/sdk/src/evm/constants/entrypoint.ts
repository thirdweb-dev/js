import { ChainId } from "./chains/ChainId";
import { constants } from "ethers";

/**
 * Returns the RoyaltyEngineV1 address for a given chain
 * @param chainId - the chain id
 * @public
 */
export function getEntrypointByChainId(chainId: number): string {
  return ENTRYPOINT_ADDRESS[chainId] || constants.AddressZero;
}

/* eslint-disable no-useless-computed-key */
export const ENTRYPOINT_ADDRESS: Record<number, string> = /* @__PURE__ */ {
  [ChainId.Mainnet]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  [ChainId.Goerli]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  [ChainId.BinanceSmartChainMainnet]:
    "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  [ChainId.Polygon]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  [ChainId.Mumbai]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  [ChainId.Avalanche]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  [ChainId.AvalancheFujiTestnet]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  [ChainId.Optimism]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  [ChainId.OptimismGoerli]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  [ChainId.Arbitrum]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  [ChainId.ArbitrumGoerli]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  [8453]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // base
  [84531]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // base-goerli
  [11155111]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // sepolia
  [59144]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // linea
  [59140]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // linea-testnet
  [44787]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // celo-alfajores-testnet
};
/* eslint-enable no-useless-computed-key */
