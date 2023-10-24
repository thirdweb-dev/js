import { Chain } from "@thirdweb-dev/chains";
import { WalletOptions } from "@thirdweb-dev/wallets";
import type {
  RecoveryShareManagement,
  PaperConstructorType,
  AuthProvider,
} from "@paperxyz/embedded-wallet-service-sdk";

export type CustomAuth = {
  jwtToken: string;
  encryptionKey: string;
};

export type OauthOptions = {
  providers: AuthProvider[];
  redirectUrl: string;
};

export type OauthOption = {
  provider: AuthProvider;
  redirectUrl: string;
};

export interface EmbeddedConnectorOptions {
  chains?: Chain[];
  chainId?: number;
  email?: string;
  phoneNumber?: string;
}

export type EmbeddedWalletOptions = Omit<
  WalletOptions<EmbeddedConnectorOptions>,
  "clientId"
>;

type EmbeddedAdvanceOptions = {
  recoveryShareManagement?: "USER_MANAGED" | "AWS_MANAGED";
};

export type EmbeddedWalletAdditionalOptions = {
  emailClientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
  advancedOptions?: EmbeddedAdvanceOptions;
  styles?: PaperConstructorType<RecoveryShareManagement>["styles"];
};

export interface EmbeddedWalletConnectorOptions {
  clientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
  chains: Chain[];
  advancedOptions?: EmbeddedAdvanceOptions;
  styles?: PaperConstructorType<RecoveryShareManagement>["styles"];
}

export interface AuthOptions {
  jwtToken: string;
  encryptionKey: string;
}

export type EmbeddedWalletConnectionArgs = {
  chainId?: number;
} & (
  | {
      loginType: "headless_google_oauth";
      redirectUrl: string;
    }
  | {
      loginType: "headless_email_otp_verification";
      email: string;
      otp: string;
    }
  | {
      loginType: "custom_jwt_auth";
      jwtToken: string;
      encryptionKey: string;
    }
);
