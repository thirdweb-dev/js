export const DEFAULT_MAX_SUPPLY_ERC20 = 10_000_000_000n;
export const DEFAULT_POOL_INITIAL_TICK = 230200;
export const DEFAULT_REFERRER_REWARD_BPS = 5000; // 50%
export const DEFAULT_INFRA_ADMIN = "0x1a472863cf21d5aa27f417df9140400324c48f22";
export const DEFAULT_FEE_RECIPIENT =
  "0x1Af20C6B23373350aD464700B5965CE4B0D2aD94";
export const DEFAULT_SALT = "0x";

export const IMPLEMENTATIONS: Record<number, Record<string, string>> = {
  8453: {
    AssetEntrypointERC20: "0xe7caeE8a2df994cE00b575eE56A3c9DecB95028D",
  },
  84532: {
    AssetEntrypointERC20: "0xa34ed67f2a327D8E87E3dFBcc7b4927df7C418ef",
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
