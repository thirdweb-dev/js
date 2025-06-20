import type { roleMap } from "thirdweb/extensions/permissions";

export const ROLE_DESCRIPTION_MAP: Record<
  keyof typeof roleMap | string,
  string
> = {
  admin:
    "Determine who can grant or revoke roles and modify settings on this contract.",
  asset: "Determine which assets can be used on this contract.",
  lister: "Determine who can create new listings on this contract.",
  minter: "Determine who can mint / create new tokens on this contract.",
  pauser:
    "Determine who can pause (and unpause) all external calls made to this contract's contract.",
  transfer: "Determine who can transfer tokens on this contract.",
  unwrap: "Determine who can unwrap tokens on this contract.",
};

// gnosis mappings
const GNOSIS_TO_CHAIN_ID = {
  avax: 43114,
  "base-gor": 84531,
  bnb: 56,
  // supported mainnets
  eth: 1,
  // supported testnets
  gor: 5,
  matic: 137,
  oeth: 10,
} as const;

export const CHAIN_ID_TO_GNOSIS = Object.entries(GNOSIS_TO_CHAIN_ID).reduce(
  (acc, [gnosis, chainId]) => ({
    // biome-ignore lint/performance/noAccumulatingSpread: FIXME
    ...acc,
    [chainId]: gnosis,
  }),
  {} as Record<
    (typeof GNOSIS_TO_CHAIN_ID)[keyof typeof GNOSIS_TO_CHAIN_ID],
    keyof typeof GNOSIS_TO_CHAIN_ID
  >,
);
