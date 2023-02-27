import { Chain } from "@thirdweb-dev/chains";

export type EmailWalletOptions = {
  clientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
};

export interface EmailWalletConnectorOptions {
  clientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
}

export interface EmailWalletConnectionArgs {
  email: string;
  handleOTP: () => Promise<string>;
}
