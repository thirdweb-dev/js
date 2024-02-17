import type { Chain, ThirdwebClient } from "../../index.js";

export type SharedDeployOptions = {
  chain: Chain;
  client: ThirdwebClient;
  forceDirectDeploy?: boolean;
  saltForProxyDeploy?: string;
  constructorParams: readonly unknown[];
};
