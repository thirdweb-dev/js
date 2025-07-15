export const DEFAULT_MAX_SUPPLY_ERC20 = 10_000_000_000n;
export const DEFAULT_POOL_INITIAL_TICK = 230200;
export const DEFAULT_REFERRER_REWARD_BPS = 5000; // 50%
export const DEFAULT_INFRA_ADMIN = "0x1a472863cf21d5aa27f417df9140400324c48f22";
export const DEFAULT_FEE_RECIPIENT =
  "0x1Af20C6B23373350aD464700B5965CE4B0D2aD94";
export const DEFAULT_SALT = "0x";

export const IMPLEMENTATIONS: Record<number, Record<string, string>> = {
  8453: {
    AssetEntrypointERC20: "0x412c90c39CbBD6A2fFDbe9bF9Aa6Ad87717f487a",
  },
  84532: {
    AssetEntrypointERC20: "0xF4d4dE479533Ee95B2b1EC10B682D4BC363E6A97",
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
