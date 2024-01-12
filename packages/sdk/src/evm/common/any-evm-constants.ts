import type { CustomChain } from "../types/any-evm/chains";

const ERROR_SUBSTRINGS = [
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

const ERROR_SUBSTRINGS_COMPOSITE = [
  ["account", "not found"],
  ["wrong", "chainid"],
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
/* eslint-enable no-useless-computed-key */

export function matchError(error: string): boolean {
  const errorIndex = ERROR_SUBSTRINGS.findIndex((substring) =>
    error.includes(substring),
  );

  const compositeErrorIndex = ERROR_SUBSTRINGS_COMPOSITE.findIndex((arr) => {
    let foundError = true;
    arr.forEach((substring) => {
      foundError &&= error.includes(substring);
    });

    return foundError;
  });

  return errorIndex !== -1 || compositeErrorIndex !== -1;
}
