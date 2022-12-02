import { ChainId, SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk/evm";
import { DashboardSolanaNetwork } from "utils/network";

const RPC_ENV =
  (process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV) ===
  "production"
    ? "rpc"
    : "rpc-staging";

export const EVM_RPC_URL_MAP: Record<SUPPORTED_CHAIN_ID, string> = addAPIKey({
  [ChainId.Mainnet]:
    process.env.SSR_RPC_MAINNET ||
    process.env.NEXT_PUBLIC_RPC_MAINNET ||
    `https://ethereum.${RPC_ENV}.thirdweb.com`,
  [ChainId.Goerli]:
    process.env.SSR_RPC_GOERLI ||
    process.env.NEXT_PUBLIC_RPC_GOERLI ||
    `https://goerli.${RPC_ENV}.thirdweb.com`,
  [ChainId.Polygon]:
    process.env.SSR_RPC_POLYGON ||
    process.env.NEXT_PUBLIC_RPC_POLYGON ||
    `https://polygon.${RPC_ENV}.thirdweb.com`,
  [ChainId.Mumbai]:
    process.env.SSR_RPC_MUMBAI ||
    process.env.NEXT_PUBLIC_RPC_MUMBAI ||
    `https://mumbai.${RPC_ENV}.thirdweb.com`,
  [ChainId.Fantom]:
    process.env.SSR_RPC_FANTOM ||
    process.env.NEXT_PUBLIC_RPC_FANTOM ||
    `https://fantom.${RPC_ENV}.thirdweb.com`,
  [ChainId.FantomTestnet]:
    process.env.SSR_RPC_FANTOM_TESTNET ||
    process.env.NEXT_PUBLIC_RPC_FANTOM_TESTNET ||
    `https://fantom-testnet.${RPC_ENV}.thirdweb.com`,
  [ChainId.Avalanche]:
    process.env.SSR_RPC_AVALANCHE ||
    process.env.NEXT_PUBLIC_RPC_AVALANCHE ||
    `https://avalanche.${RPC_ENV}.thirdweb.com`,
  [ChainId.AvalancheFujiTestnet]:
    process.env.SSR_RPC_AVALANCHE_FUJI_TESTNET ||
    process.env.NEXT_PUBLIC_RPC_AVALANCHE_FUJI_TESTNET ||
    `https://avalanche-fuji.${RPC_ENV}.thirdweb.com`,
  [ChainId.Optimism]:
    process.env.SSR_RPC_OPTIMISM ||
    process.env.NEXT_PUBLIC_RPC_OPTIMISM ||
    `https://optimism.${RPC_ENV}.thirdweb.com`,
  [ChainId.OptimismGoerli]:
    process.env.SSR_RPC_OPTIMISM_GOERLI ||
    process.env.NEXT_PUBLIC_RPC_OPTIMISM_GOERLI ||
    `https://optimism-goerli.${RPC_ENV}.thirdweb.com`,
  [ChainId.Arbitrum]:
    process.env.SSR_RPC_ARBITRUM ||
    process.env.NEXT_PUBLIC_RPC_ARBITRUM ||
    `https://arbitrum.${RPC_ENV}.thirdweb.com`,
  [ChainId.ArbitrumGoerli]:
    process.env.SSR_RPC_ARBITRUM_GOERLI ||
    process.env.NEXT_PUBLIC_RPC_ARBITRUM_GOERLI ||
    `https://arbitrum-goerli.${RPC_ENV}.thirdweb.com`,
  [ChainId.BinanceSmartChainMainnet]:
    process.env.SSR_RPC_BINANCE_MAINNET ||
    process.env.NEXT_PUBLIC_RPC_BINANCE_MAINNET ||
    `https://binance.${RPC_ENV}.thirdweb.com`,
  [ChainId.BinanceSmartChainTestnet]:
    process.env.SSR_RPC_BINANCE_TESTNET ||
    process.env.NEXT_PUBLIC_RPC_BINANCE_TESTNET ||
    `https://binance-testnet.${RPC_ENV}.thirdweb.com`,
});

const SOLANA_RPC_URL_MAP: Record<DashboardSolanaNetwork, string> = {
  ...addAPIKey({
    "mainnet-beta":
      process.env.SSR_RPC_SOLANA ||
      process.env.NEXT_PUBLIC_RPC_SOLANA ||
      `https://solana.${RPC_ENV}.thirdweb.com`,
    devnet:
      process.env.SSR_RPC_SOLANA_DEVNET ||
      process.env.NEXT_PUBLIC_RPC_SOLANA_DEVNET ||
      `https://solana-devnet.${RPC_ENV}.thirdweb.com`,
  }),
};

function addAPIKey<T extends string | number>(
  input: Record<T, string>,
): Record<T, string> {
  const entries = (Object.entries(input) as [T, string][]).map(
    ([key, value]) => {
      const url = new URL(value);
      if (!url.hostname.includes("thirdweb.com")) {
        return [key, value];
      }
      url.pathname =
        "ed043a51ae23b0db3873f5a38b77ab28175fa496f15d3c53cf70401be89b622a";
      return [key, url.toString()];
    },
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
