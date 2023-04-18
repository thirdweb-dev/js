import type { Chain } from "@thirdweb-dev/chains";
import { EVMWallet } from "../../interfaces";

export interface SafeConnectionArgs {
  safeAddress: string;
  personalWallet: EVMWallet;
  chain: Pick<Chain, "chainId" | "rpc">;
}
