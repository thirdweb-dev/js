export const DEFAULT_MAX_SUPPLY_ERC20 = 10_000_000_000n;
export const DEFAULT_POOL_FEE = 10000;
export const DEFAULT_POOL_INITIAL_TICK = 230200;
export const DEFAULT_INFRA_ADMIN = "0x1a472863cf21d5aa27f417df9140400324c48f22";
export const DEFAULT_FEE_RECIPIENT =
  "0x1af20c6b23373350ad464700b5965ce4b0d2ad94";
export const DEFAULT_FEE_BPS = 50n;
export const DEFAULT_SALT = "thirdweb";

export const IMPLEMENTATIONS: Record<number, Record<string, string>> = {
  84532: {
    AssetEntrypointERC20: "0x79C1236cFe59f1f088A15Da08b0D8667387d9703",
    ERC20AssetImpl: "",
    V3PositionManager: "",
    V4PositionManager: "",
  },
  8453: {
    AssetEntrypointERC20: "0xad8978A9E8E39c5Ba81cAcE02358e4D90A7dBDcC",
    ERC20AssetImpl: "",
    V3PositionManager: "",
    V4PositionManager: "",
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
