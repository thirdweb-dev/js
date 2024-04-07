import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";

/**
 * Represents the options to retrieve a Farcaster contract
 */
export type FarcasterContractOptions = {
  client: ThirdwebClient;
  chain?: Chain;
};
