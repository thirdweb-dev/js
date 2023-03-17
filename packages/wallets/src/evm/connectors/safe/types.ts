import type { AbstractWallet } from "../../wallets/abstract";
import type { Chain } from "@thirdweb-dev/chains";

export type SafeOptions = {};

export interface SafeConnectionArgs {
  safeAddress: string;
  personalWallet: AbstractWallet;
  chain: Pick<Chain, "chainId" | "rpc">;
}
