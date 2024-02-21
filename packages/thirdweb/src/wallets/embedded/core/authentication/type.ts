import type { ThirdwebClient } from "../../../../client/client.js";

// 2 Step Auth Flow Type
export type InitiateAuthType = "auth" | "2fa" | "link";
export type MultiStepAuthProviderType = {
  strategy: "email";
  email: string;
};
export type PreAuthArgsType = MultiStepAuthProviderType & {
  client: ThirdwebClient;
};

// General Auth Flow Type
export type MultiStepAuthArgsType = MultiStepAuthProviderType & {
  verificationCode: string;
};
export type SingleStepAuthArgsType =
  | {
      strategy: "google";
      openedWindow?: Window;
      closeOpenedWindow?: (window: Window) => void;
    }
  | {
      strategy: "apple";
      openedWindow?: Window;
      closeOpenedWindow?: (window: Window) => void;
    }
  | {
      strategy: "facebook";
      openedWindow?: Window;
      closeOpenedWindow?: (window: Window) => void;
    }
  | { strategy: "jwt"; jwt: string; encryptionKey: string }
  | { strategy: "auth_endpoint"; payload: string; encryptionKey: string }
  | { strategy: "iframe_email_verification"; email: string }
  | { strategy: "iframe" };

export type AuthArgsType = (MultiStepAuthArgsType | SingleStepAuthArgsType) & {
  client: ThirdwebClient;
};
