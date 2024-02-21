import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";

export type SharedDeployOptions = {
  chain: Chain;
  client: ThirdwebClient;
  forceDirectDeploy?: boolean;
  saltForProxyDeploy?: string;
  constructorParams: readonly unknown[];
};
