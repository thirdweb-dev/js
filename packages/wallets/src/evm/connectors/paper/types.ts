import type { Chain } from "@thirdweb-dev/chains";

export type PaperWalletAdditionalOptions = {
  clientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
};

export interface PaperWalletConnectorOptions {
  clientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
  chains: Chain[];
}

export interface PaperWalletConnectionArgs {}
