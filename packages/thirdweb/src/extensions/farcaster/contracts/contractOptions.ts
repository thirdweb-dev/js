import type { ThirdwebClient } from "../../../client/client.js";
import type { Chain } from "../../../chains/types.js";

/**
 * Represents the options to retrieve a Farcaster contract
 */
export type FarcasterContractOptions = {
  client: ThirdwebClient;
  chain?: Chain;
};
