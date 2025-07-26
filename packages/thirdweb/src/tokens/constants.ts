export const DEFAULT_MAX_SUPPLY_ERC20 = 1_000_000_000n;
export const DEFAULT_POOL_INITIAL_TICK = 230200;

export const DEFAULT_REFERRER_REWARD_BPS = 625; // 6.25% (6.25% * 80% = 5%)
export const DEFAULT_REFERRER_ADDRESS =
  "0x1Af20C6B23373350aD464700B5965CE4B0D2aD94";

export const IMPLEMENTATIONS: Record<number, Record<string, string>> = {
  8453: {
    EntrypointERC20: "",
  },
  84532: {
    EntrypointERC20: "0x76d5aa9dEC618b54186DCa332C713B27A8ea70Ac",
  },
};
