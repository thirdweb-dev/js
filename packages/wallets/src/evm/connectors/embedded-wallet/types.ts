import type { Chain } from "@thirdweb-dev/chains";
import { EmbeddedWalletConstructorType } from "./implementations";

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
      encryptionKey?: string;
    }
  | {
      loginType: "ui_email_otp";
      email: string;
    }
  | {
      loginType: "custom_jwt_auth";
      jwt: string;
      encryptionKey: string;
    }
);
