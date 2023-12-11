import type { Chain } from "@thirdweb-dev/chains";
import { AuthAndWalletRpcReturnType, InitializedUser } from "./implementations";

export type EmbeddedWalletAdditionalOptions = {
  chain: Pick<Chain, "chainId" | "rpc">;
  clientId: string;
  onAuthSuccess?: (authResult: AuthAndWalletRpcReturnType) => void;
};

export interface EmbeddedWalletConnectorOptions {
  clientId: string;
  chains: Chain[];
  chain: Pick<Chain, "chainId" | "rpc">;
  onAuthSuccess?: (authResult: AuthAndWalletRpcReturnType) => void;
}

export type EmbeddedWalletConnectionArgs = {
  chainId?: number;
  authResult: AuthResult;
};

type EmailVerificationAuthParams = {
  strategy: "email_verification";
  email: string;
  verificationCode: string;
  recoveryCode?: string;
};

export type EmbeddedWalletOauthStrategy = "google" | "apple" | "facebook";

type OauthAuthParams = {
  strategy: EmbeddedWalletOauthStrategy;
  openedWindow?: Window;
  closeOpenedWindow?: (window: Window) => void;
};

type JwtAuthParams = {
  strategy: "jwt";
  jwt: string;
  encryptionKey: string;
};

type AuthEndpointParams = {
  strategy: "auth_endpoint";
  payload: string;
  encryptionKey: string;
};

// open iFrame to send and input the OTP
type IframeOtpAuthParams = {
  strategy: "iframe_email_verification";
  email: string;
};

// open iFrame to enter email and OTP
type IframeAuthParams = {
  strategy: "iframe";
};

// this is the input to 'authenticate'
export type AuthParams =
  | EmailVerificationAuthParams
  | OauthAuthParams
  | JwtAuthParams
  | AuthEndpointParams
  | IframeOtpAuthParams
  | IframeAuthParams;

// TODO typed based off AuthParams["strategy"]
export type AuthResult = {
  user?: InitializedUser;
  isNewUser?: boolean;
  needsRecoveryCode?: boolean;
};
