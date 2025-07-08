import type { Chain } from "../../../../../../../chains/types.js";

export type SupportedChainAndTokens = Array<{
  chain: Chain;
  tokens: Array<{
    address: string;
    buyWithCryptoEnabled: boolean;
    buyWithFiatEnabled: boolean;
    name: string;
    symbol: string;
    icon?: string;
  }>;
}>;
