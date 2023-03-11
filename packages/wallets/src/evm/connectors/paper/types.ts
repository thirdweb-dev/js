import { Chain } from "@thirdweb-dev/chains";

export type PaperWalletOptions = {
  clientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
};

export interface PaperWalletConnectorOptions {
  clientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
}

export interface PaperWalletConnectionArgs {
  email: string;
}
