export const DEFAULT_MAX_SUPPLY_ERC20 = 1_000_000_000n;
export const DEFAULT_POOL_INITIAL_TICK = 230200;
export const DEFAULT_INFRA_ADMIN = "0x1a472863cf21d5aa27f417df9140400324c48f22";

export const DEFAULT_REFERRER_REWARD_BPS = 625; // 6.25% (6.25% * 80% = 5%)
export const DEFAULT_REFERRER_ADDRESS =
  "0x1Af20C6B23373350aD464700B5965CE4B0D2aD94";

export const IMPLEMENTATIONS: Record<number, Record<string, string>> = {
  8453: {
    AssetEntrypointERC20: "0x70458B0b8afA1113b5716C0e213Bc3a48bFcFF74",
  },
  84532: {
    AssetEntrypointERC20: "0x69e8298bB5c52FF8385a5Ea51688dbEe13e75ece",
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
  DISTRIBUTE = 2, // distribute tokens to recipients
  EXTERNAL_HOOK = 3, // call an external hook contract
}
