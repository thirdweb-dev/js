import type { AbstractClientWallet } from "../../wallets/base";
import type { Chain } from "@thirdweb-dev/chains";

export interface SafeConnectionArgs {
  safeAddress: string;
  personalWallet: AbstractClientWallet;
  chain: Pick<Chain, "chainId" | "rpc">;
}
