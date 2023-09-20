import type {
  PaperConstructorType,
  RecoveryShareManagement,
} from "@paperxyz/embedded-wallet-service-sdk";
import type { Chain } from "@thirdweb-dev/chains";

type PaperAdvanceOptions = {
  recoveryShareManagement?: "USER_MANAGED" | "AWS_MANAGED";
};

export type PaperWalletAdditionalOptions = {
  chain: Pick<Chain, "chainId" | "rpc">;
  advancedOptions?: PaperAdvanceOptions;
  styles?: PaperConstructorType<RecoveryShareManagement>["styles"];
  paperClientId?: string;
  clientId?: string;
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
  googleLogin?: true;
}
