import { DashboardSolanaNetwork } from "utils/solanaUtils";

export const DASHBOARD_THIRDWEB_API_KEY =
  "ed043a51ae23b0db3873f5a38b77ab28175fa496f15d3c53cf70401be89b622a";

export const RPC_ENV =
  (process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV) ===
  "production"
    ? "rpc"
    : "rpc-staging";

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
      url.pathname = DASHBOARD_THIRDWEB_API_KEY;
      return [key, url.toString()];
    },
  );

  return Object.fromEntries(entries);
}

// SOLANA
export function getSOLRPC(network: DashboardSolanaNetwork) {
  return SOLANA_RPC_URL_MAP[network];
}
