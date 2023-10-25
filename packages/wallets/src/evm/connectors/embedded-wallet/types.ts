import type { Chain } from "@thirdweb-dev/chains";
import {
  EmbeddedWalletConstructorType,
  SendEmailOtpReturnType,
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
  authData: AuthData;
  extraArgs?: ExtraArgs;
};

type EmailAuthParams = {
  strategy: "email";
  email: string;
};

type GoogleAuthParams = {
  strategy: "google";
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
  | EmailAuthParams
  | GoogleAuthParams
  | JwtAuthParams
  | IframeOtpAuthParams
  | IframeAuthParams;

// this is the output of 'authenticate', decorates the AuthParams with extra data when needed
export type AuthData =
  | (EmailAuthParams & {
      result: SendEmailOtpReturnType;
    })
  | GoogleAuthParams
  | JwtAuthParams
  | IframeOtpAuthParams
  | IframeAuthParams;

// TODO typed based off AuthData["strategy"]
export type ExtraArgs = {
  openedWindow?: Window;
  closeOpenedWindow?: (window: Window) => void;
  password?: string;
  otp?: string;
};
