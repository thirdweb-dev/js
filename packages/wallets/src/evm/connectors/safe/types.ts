import type { AbstractBrowserWallet } from "../../wallets/base";
import type { Chain } from "@thirdweb-dev/chains";

export interface SafeConnectionArgs {
  safeAddress: string;
  personalWallet: AbstractBrowserWallet;
  chain: Pick<Chain, "chainId" | "rpc">;
}
