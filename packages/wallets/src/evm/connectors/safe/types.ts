// import type { AbstractWallet } from "../../wallets/abstract";
import type { Chain } from "@thirdweb-dev/chains";
import type { AbstractBrowserWallet } from "../../wallets/base";

export interface SafeConnectionArgs {
  safeAddress: string;
  personalWallet: AbstractBrowserWallet;
  chain: Pick<Chain, "chainId" | "rpc">;
}
