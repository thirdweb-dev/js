import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";

export type EmbeddedWalletConfig = {
  client: ThirdwebClient;
  defaultChain?: Chain;
};
