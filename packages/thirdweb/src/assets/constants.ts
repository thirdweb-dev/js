export const DEFAULT_MAX_SUPPLY_ERC20 = 1_000_000_000n;
export const DEFAULT_POOL_INITIAL_TICK = 230200;
export const DEFAULT_REFERRER_REWARD_BPS = 1250; // 12.50%
export const DEFAULT_INFRA_ADMIN = "0x1a472863cf21d5aa27f417df9140400324c48f22";
export const DEFAULT_FEE_RECIPIENT =
  "0x1Af20C6B23373350aD464700B5965CE4B0D2aD94";
export const DEFAULT_SALT = "0x";

export const IMPLEMENTATIONS: Record<number, Record<string, string>> = {
  8453: {
    AssetEntrypointERC20: "0x42e3a6eB0e96641Bd6e0604D5C6Bb96db874A942",
  },
  84532: {
    AssetEntrypointERC20: "0xcB8ab50D2E7E2e2f46a2BF440e60375b28A4b82f",
  },
};

export enum ImplementationType {
  CLONE = 0,
  CLONE_WITH_IMMUTABLE_ARGS = 1,
  ERC1967 = 2,
  ERC1967_WITH_IMMUTABLE_ARGS = 3,
}

export enum CreateHook {
  NONE = 0, // do nothing
  CREATE_POOL = 1, // create a DEX pool via Router
  CREATE_MARKET = 2, // create a market sale via Router
  DISTRIBUTE = 3, // distribute tokens to recipients
  EXTERNAL_HOOK = 4, // call an external hook contract
}
