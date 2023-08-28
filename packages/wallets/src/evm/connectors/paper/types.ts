import type { Chain } from "@thirdweb-dev/chains";
import type {
  RecoveryShareManagement,
  PaperConstructorType,
} from "@paperxyz/embedded-wallet-service-sdk";

type PaperAdvanceOptions = {
  recoveryShareManagement?: "USER_MANAGED" | "AWS_MANAGED";
};

export type PaperWalletAdditionalOptions = {
  paperClientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
  advancedOptions?: PaperAdvanceOptions;
  styles?: PaperConstructorType<RecoveryShareManagement>["styles"];
};

export interface PaperWalletConnectorOptions {
  clientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
  chains: Chain[];
  advancedOptions?: PaperAdvanceOptions;
  styles?: PaperConstructorType<RecoveryShareManagement>["styles"];
}

export interface PaperWalletConnectionArgs {
  email?: string;
  otp?: string;
  recoveryCode?: string;
}
