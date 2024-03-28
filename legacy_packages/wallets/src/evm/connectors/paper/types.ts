import type {
  AuthAndWalletRpcReturnType,
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
  onAuthSuccess?: (authResult: AuthAndWalletRpcReturnType) => void;
};

export interface PaperWalletConnectorOptions {
  clientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
  chains: Chain[];
  advancedOptions?: PaperAdvanceOptions;
  styles?: PaperConstructorType<RecoveryShareManagement>["styles"];
  onAuthSuccess?: (authResult: AuthAndWalletRpcReturnType) => void;
}

export interface PaperWalletConnectionArgs {
  email?: string;
  otp?: string;
  recoveryCode?: string;
  googleLogin?:
    | true
    | {
        openedWindow?: Window;
        closeOpenedWindow?: (openedWindow: Window) => void;
      };
}
