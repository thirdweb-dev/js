import { Chains } from "@paperxyz/embedded-wallet-service-sdk";

export type EmailWalletOptions = {
  clientId: string;
  chainId: number;
};

export interface EmailWalletConnectorOptions {
  clientId: string;
  chain: Chains;
}

export interface EmailWalletConnectionArgs {
  email: string;
  handleOTP: () => Promise<string>;
}
