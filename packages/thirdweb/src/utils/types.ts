import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import type { Account } from "../wallets/interfaces/wallet.js";
import type { Prettify } from "./type-utils.js";

/**
 * @internal
 */
export type ClientAndChain = {
  client: ThirdwebClient;
  chain: Chain;
};

/**
 * @internal
 */
export type ClientAndChainAndAccount = Prettify<
  ClientAndChain & { account: Account }
>;
