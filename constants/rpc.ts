import { ChainId, SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk/evm";
import { isBrowser } from "utils/isBrowser";
import { DashboardSolanaNetwork } from "utils/network";

export const EVM_RPC_URL_MAP: Record<SUPPORTED_CHAIN_ID, string> = addAPIKey({
  [ChainId.Mainnet]:
    process.env.SSR_RPC_MAINNET ||
    process.env.NEXT_PUBLIC_RPC_MAINNET ||
    `https://eth-mainnet.g.alchemy.com/v2/`,
  [ChainId.Goerli]:
    process.env.SSR_RPC_GOERLI ||
    process.env.NEXT_PUBLIC_RPC_GOERLI ||
    `https://eth-goerli.g.alchemy.com/v2/`,
  [ChainId.Polygon]:
    process.env.SSR_RPC_POLYGON ||
    process.env.NEXT_PUBLIC_RPC_POLYGON ||
    `https://polygon-mainnet.g.alchemy.com/v2/`,
  [ChainId.Mumbai]:
    process.env.SSR_RPC_MUMBAI ||
    process.env.NEXT_PUBLIC_RPC_MUMBAI ||
    `https://polygon-mumbai.g.alchemy.com/v2/`,
  [ChainId.Fantom]:
    process.env.SSR_RPC_FANTOM ||
    process.env.NEXT_PUBLIC_RPC_FANTOM ||
    "https://rpc.ftm.tools",
  [ChainId.FantomTestnet]:
    process.env.SSR_RPC_FANTOM_TESTNET ||
    process.env.NEXT_PUBLIC_RPC_FANTOM_TESTNET ||
    "https://rpc.testnet.fantom.network",
  [ChainId.Avalanche]:
    process.env.SSR_RPC_AVALANCHE ||
    process.env.NEXT_PUBLIC_RPC_AVALANCHE ||
    "https://api.avax.network/ext/bc/C/rpc",
  [ChainId.AvalancheFujiTestnet]:
    process.env.SSR_RPC_AVALANCHE_FUJI_TESTNET ||
    process.env.NEXT_PUBLIC_RPC_AVALANCHE_FUJI_TESTNET ||
    "https://api.avax-test.network/ext/bc/C/rpc",
  [ChainId.Optimism]:
    process.env.SSR_RPC_OPTIMISM ||
    process.env.NEXT_PUBLIC_RPC_OPTIMISM ||
    `https://opt-mainnet.g.alchemy.com/v2/`,
  [ChainId.OptimismGoerli]:
    process.env.SSR_RPC_OPTIMISM_GOERLI ||
    process.env.NEXT_PUBLIC_RPC_OPTIMISM_GOERLI ||
    `https://opt-goerli.g.alchemy.com/v2/`,
  [ChainId.Arbitrum]:
    process.env.SSR_RPC_ARBITRUM ||
    process.env.NEXT_PUBLIC_RPC_ARBITRUM ||
    `https://arb-mainnet.g.alchemy.com/v2/`,
  [ChainId.ArbitrumGoerli]:
    process.env.SSR_RPC_ARBITRUM_GOERLI ||
    process.env.NEXT_PUBLIC_RPC_ARBITRUM_GOERLI ||
    `https://arb-goerli.g.alchemy.com/v2/`,
  [ChainId.BinanceSmartChainMainnet]:
    process.env.SSR_RPC_BINANCE_MAINNET ||
    process.env.NEXT_PUBLIC_RPC_BINANCE_MAINNET ||
    "https://bsc-dataseed1.binance.org",
  [ChainId.BinanceSmartChainTestnet]:
    process.env.SSR_RPC_BINANCE_TESTNET ||
    process.env.NEXT_PUBLIC_RPC_BINANCE_TESTNET ||
    "https://data-seed-prebsc-1-s1.binance.org:8545",
});

const SOLANA_RPC_URL_MAP: Record<DashboardSolanaNetwork, string> = addAPIKey({
  "mainnet-beta": `https://solana-mainnet.g.alchemy.com/v2/`,
  devnet: `https://solana-devnet.g.alchemy.com/v2/`,
});

function addAPIKey<T extends string | number>(
  input: Record<T, string>,
): Record<T, string> {
  const entries = (Object.entries(input) as [T, string][]).map(
    ([key, value]) => [
      key,
      value.endsWith("alchemy.com/v2/")
        ? `${value}${
            isBrowser()
              ? process.env.NEXT_PUBLIC_ALCHEMY_KEY
              : process.env.SSR_ALCHEMY_KEY
          }`
        : value,
    ],
  );

  return Object.fromEntries(entries);
}

// SOLANA
export function getSOLRPC(network: DashboardSolanaNetwork) {
  return SOLANA_RPC_URL_MAP[network];
}

// EVM
export function getEVMRPC(chainId: SUPPORTED_CHAIN_ID) {
  return EVM_RPC_URL_MAP[chainId];
}
