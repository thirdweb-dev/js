import { Chain } from "@thirdweb-dev/chains";
import { WalletOptions } from "@thirdweb-dev/wallets";

import type {
  RecoveryShareManagement,
  PaperConstructorType,
} from "@paperxyz/embedded-wallet-service-sdk";

export interface EmailConnectorOptions {
  chains?: Chain[];
  chainId?: number;
  email?: string;
  phoneNumber?: string;
}

export type EmailWalletOptions = Omit<
  WalletOptions<EmailConnectorOptions>,
  "clientId"
>;

type EmailAdvanceOptions = {
  recoveryShareManagement?: "USER_MANAGED" | "AWS_MANAGED";
};

export type EmailWalletAdditionalOptions = {
  emailClientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
  advancedOptions?: EmailAdvanceOptions;
  styles?: PaperConstructorType<RecoveryShareManagement>["styles"];
};

export interface EmailWalletConnectorOptions {
  clientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
  chains: Chain[];
  advancedOptions?: EmailAdvanceOptions;
  styles?: PaperConstructorType<RecoveryShareManagement>["styles"];
}

export interface EmailWalletConnectionArgs {
  email?: string;
}
