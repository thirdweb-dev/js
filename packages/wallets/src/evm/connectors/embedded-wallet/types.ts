import type { Chain } from "@thirdweb-dev/chains";
import { EmbeddedWalletConstructorType } from "./implementations";

export type EmbeddedWalletAdditionalOptions = {
  chain: Pick<Chain, "chainId" | "rpc">;
  clientId: string;
  styles?: EmbeddedWalletConstructorType["styles"];
};

export interface EmbeddedWalletConnectorOptions {
  clientId: string;
  chains: Chain[];
  chain: Pick<Chain, "chainId" | "rpc">;
  styles?: EmbeddedWalletConstructorType["styles"];
}

export interface EmbeddedWalletConnectionArgs {
  email?: string;
  otp?: string;
  recoveryCode?: string;
  googleLogin?: true | { windowOpened: Window };
}
