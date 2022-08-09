import { ChainId, SUPPORTED_CHAIN_ID, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { StorageSingleton } from "components/app-layouts/providers";

const alchemyUrlMap: Record<SUPPORTED_CHAIN_ID, string> = {
  [ChainId.Mainnet]:
    process.env.SSR_RPC_MAINNET ||
    `https://eth-mainnet.g.alchemy.com/v2/${process.env.SSR_ALCHEMY_KEY}`,
  [ChainId.Rinkeby]:
    process.env.SSR_RPC_RINKEBY ||
    `https://eth-rinkeby.g.alchemy.com/v2/${process.env.SSR_ALCHEMY_KEY}`,
  [ChainId.Goerli]:
    process.env.SSR_RPC_GOERLI ||
    `https://eth-goerli.g.alchemy.com/v2/${process.env.SSR_ALCHEMY_KEY}`,
  [ChainId.Polygon]:
    process.env.SSR_RPC_POLYGON ||
    `https://polygon-mainnet.g.alchemy.com/v2/${process.env.SSR_ALCHEMY_KEY}`,
  [ChainId.Mumbai]:
    process.env.SSR_RPC_MUMBAI ||
    `https://polygon-mumbai.g.alchemy.com/v2/${process.env.SSR_ALCHEMY_KEY}`,
  [ChainId.Fantom]:
    process.env.SSR_RPC_FANTOM || "https://rpc.ftm.tools",
  [ChainId.FantomTestnet]:
    process.env.SSR_RPC_FANTOM_TESTNET ||
    "https://rpc.testnet.fantom.network",
  [ChainId.Avalanche]:
    process.env.SSR_RPC_AVALANCHE ||
    "https://api.avax.network/ext/bc/C/rpc",
  [ChainId.AvalancheFujiTestnet]:
    process.env.SSR_RPC_AVALANCHE_FUJI_TESTNET ||
    "https://api.avax-test.network/ext/bc/C/rpc",
  [ChainId.Optimism]:
    process.env.SSR_RPC_OPTIMISM ||
    `https://opt-mainnet.g.alchemy.com/v2/${process.env.SSR_ALCHEMY_KEY}`,
  [ChainId.OptimismTestnet]:
    process.env.SSR_RPC_OPTIMISM_TESTNET ||
    `https://opt-kovan.g.alchemy.com/v2/${process.env.SSR_ALCHEMY_KEY}`,
  [ChainId.Arbitrum]:
    process.env.SSR_RPC_ARBITRUM ||
    `https://arb-mainnet.g.alchemy.com/v2/${process.env.SSR_ALCHEMY_KEY}`,
  [ChainId.ArbitrumTestnet]:
    process.env.SSR_RPC_ARBITRUM_TESTNET ||
    `https://arb-rinkeby.g.alchemy.com/v2/${process.env.SSR_ALCHEMY_KEY}`,
};

export function getSSRRPCUrl(chainId: SUPPORTED_CHAIN_ID) {
  return alchemyUrlMap[chainId];
}

export function getSSRSDK(chainId: SUPPORTED_CHAIN_ID): ThirdwebSDK {
  return new ThirdwebSDK(getSSRRPCUrl(chainId), {readonlySettings: {
    chainId,
    rpcUrl: getSSRRPCUrl(chainId)
  }}, StorageSingleton);
}