import type { CustomChain } from "../types/any-evm/chains";

export const ERROR_SUBSTRINGS = [
  "eip-155",
  "eip155",
  "protected",
  "invalid chain id for signer",
  "chain id none",
  "chain_id mismatch",
  "recovered sender mismatch",
  "transaction hash mismatch",
  "chainid no support",
  "chainid (0)",
  "chainid(0)",
];

export const ERROR_SUBSTRINGS_COMPOSITE = [
  ["account", "not found"],
  ["wrong", "chainid"],
];

export const CUSTOM_GAS_BINS = [
  1n,
  1n * 10n ** 9n,
  100n * 10n ** 9n,
  500n * 10n ** 9n,
  1000n * 10n ** 9n,
  2500n * 10n ** 9n,
  5000n * 10n ** 9n,
  7500n * 10n ** 9n,
  10_000n * 10n ** 9n,
  25_000n * 10n ** 9n,
  50_000n * 10n ** 9n,
  75_000n * 10n ** 9n,
  100_000n * 10n ** 9n,
  250_000n * 10n ** 9n,
  500_000n * 10n ** 9n,
  750_000n * 10n ** 9n,
  1_000_000n * 10n ** 9n,
];

/* eslint-disable no-useless-computed-key */
export const CUSTOM_GAS_FOR_CHAIN: Record<number, CustomChain> = {
  [5001]: {
    name: "Mantle Testnet",
    gasPrice: 1n,
  },
  [71402]: {
    name: "Godwoken Mainnet",
    gasPrice: 40000n * 10n ** 9n,
  },
  [1351057110]: {
    name: "Chaos (SKALE Testnet)",
    gasPrice: 100000n,
  },
  [361]: {
    name: "Theta Mainnet",
    gasPrice: 4000n * 10n ** 9n,
  },
  [365]: {
    name: "Theta Testnet",
    gasPrice: 4000n * 10n ** 9n,
  },
  [7700]: {
    name: "Canto",
    gasPrice: 1000n * 10n ** 9n,
  },
  [7701]: {
    name: "Canto Testnet",
    gasPrice: 1000n * 10n ** 9n,
  },
  [338]: {
    name: "Cronos Testnet",
    gasPrice: 2000n * 10n ** 9n,
  },
  [47]: {
    name: "Xpla Testnet",
    gasPrice: 850n * 10n ** 9n,
  },
  [37]: {
    name: "Xpla Mainnet",
    gasPrice: 5100n * 10n ** 9n,
  },
  [199]: {
    name: "BitTorrent Chain",
    gasPrice: 300000n * 10n ** 9n,
  },
  [88882]: {
    name: "Spicy Chain",
    gasPrice: 2500n * 10n ** 9n,
    gasLimit: 200000n,
  },
  [88888]: {
    name: "Chiliz Chain",
    gasPrice: 2500n * 10n ** 9n,
    gasLimit: 200000n,
  },
};

export function matchError(error: string): boolean {
  const hasError = ERROR_SUBSTRINGS.some((substring) =>
    error.includes(substring),
  );
  // can early exit if we find a match
  if (hasError) {
    return true;
  }

  const hasCompositeError = ERROR_SUBSTRINGS_COMPOSITE.some((arr) => {
    return arr.some((substring) => error.includes(substring));
  });

  return hasCompositeError;
}
