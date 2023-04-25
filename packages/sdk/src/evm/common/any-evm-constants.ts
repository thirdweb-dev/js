import { CustomChain } from "../types/any-evm/chains";

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
];

export const ERROR_SUBSTRINGS_COMPOSITE = [
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
    gasPrice: 40_000 * 10 ** 9,
  },
  [1351057110]: {
    name: "Chaos (SKALE Testnet)",
    gasPrice: 100000,
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
