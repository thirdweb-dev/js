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

export type PaperWalletConnectionArgs = {
  chainId?: number;
} & (
  | {
      loginType: "headless_google_oauth";
      openedWindow?: Window;
      closeOpenedWindow?: (window: Window) => void;
    }
  | {
      loginType: "headless_email_otp_verification";
      email: string;
      otp: string;
    }
  | {
      loginType: "ui_email_otp";
      email: string;
    }
);
