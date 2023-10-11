import { Chain } from "@thirdweb-dev/chains";

// eslint-disable-next-line @typescript-eslint/ban-types
export interface ComethWalletConfig {
  chain: Chain;
  apiKey: string;
  walletAddress?: string;
  rpcUrl?: string;
}
