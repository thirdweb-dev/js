import type { Chain } from "@thirdweb-dev/chains";
import {
  EmbeddedWalletConstructorType,
  InitializedUser,
} from "./implementations";

export type EmbeddedWalletAdditionalOptions = {
  chain: Pick<Chain, "chainId" | "rpc">;
  clientId: string;
  styles?: EmbeddedWalletConstructorType["styles"];
};

export interface EmbeddedWalletConnectorOptions {
  clientId: string;
  chains: Chain[];
  chain: Pick<Chain, "chainId" | "rpc">;
  styles?: EmbeddedWalletConstructorType["styles"];
}

export type EmbeddedWalletConnectionArgs = {
  chainId?: number;
  authResult: AuthResult;
};

type EmailOtpAuthParams = {
  strategy: "email_otp";
  email: string;
  otp: string;
  recoveryCode?: string;
};

type GoogleAuthParams = {
  strategy: "google";
  openedWindow?: Window;
  closeOpenedWindow?: (window: Window) => void;
};

type JwtAuthParams = {
  strategy: "jwt";
  jwt: string;
};

// open iFrame to send and input the OTP
type IframeOtpAuthParams = {
  strategy: "iframe_otp";
  email: string;
};

// open iFrame to enter email and OTP
type IframeAuthParams = {
  strategy: "iframe";
};

// this is the input to 'authenticate'
export type AuthParams =
  | EmailOtpAuthParams
  | GoogleAuthParams
  | JwtAuthParams
  | IframeOtpAuthParams
  | IframeAuthParams;

// TODO typed based off AuthParams["strategy"]
export type AuthResult = {
  user?: InitializedUser;
  isNewUser?: boolean;
  needsRecoveryCode?: boolean;
  verifyOTP?: (otp: string, recoveryCode?: string) => Promise<AuthResult>;
};
