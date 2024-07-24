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
  1,
  1 * 10 ** 9,
  100 * 10 ** 9,
  500 * 10 ** 9,
  1000 * 10 ** 9,
  2500 * 10 ** 9,
  5000 * 10 ** 9,
  7500 * 10 ** 9,
  10_000 * 10 ** 9,
  25_000 * 10 ** 9,
  50_000 * 10 ** 9,
  75_000 * 10 ** 9,
  100_000 * 10 ** 9,
  250_000 * 10 ** 9,
  500_000 * 10 ** 9,
  750_000 * 10 ** 9,
  1_000_000 * 10 ** 9,
];

/* eslint-disable no-useless-computed-key */
export const CUSTOM_GAS_FOR_CHAIN: Record<number, CustomChain> = {
  [5001]: {
    name: "Mantle Testnet",
    gasPrice: 1,
  },
  [71402]: {
    name: "Godwoken Mainnet",
    gasPrice: 40000 * 10 ** 9,
  },
  [1351057110]: {
    name: "Chaos (SKALE Testnet)",
    gasPrice: 100000,
  },
  [361]: {
    name: "Theta Mainnet",
    gasPrice: 4000 * 10 ** 9,
  },
  [365]: {
    name: "Theta Testnet",
    gasPrice: 4000 * 10 ** 9,
  },
  [7700]: {
    name: "Canto",
    gasPrice: 1000 * 10 ** 9,
  },
  [7701]: {
    name: "Canto Testnet",
    gasPrice: 1000 * 10 ** 9,
  },
  [338]: {
    name: "Cronos Testnet",
    gasPrice: 2000 * 10 ** 9,
  },
  [47]: {
    name: "Xpla Testnet",
    gasPrice: 850 * 10 ** 9,
  },
  [37]: {
    name: "Xpla Mainnet",
    gasPrice: 5100 * 10 ** 9,
  },
  [199]: {
    name: "BitTorrent Chain",
    gasPrice: 300000 * 10 ** 9,
  },
  [88882]: {
    name: "Spicy Chain",
    gasPrice: 2500 * 10 ** 9,
    gasLimit: 200000,
  },
  [88888]: {
    name: "Chiliz Chain",
    gasPrice: 2500 * 10 ** 9,
    gasLimit: 200000,
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
    let foundError = true;
    arr.forEach((substring) => {
      foundError &&= error.includes(substring);
    });

    return foundError;
  });

  return hasCompositeError;
}
