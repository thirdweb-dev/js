import type { ThirdwebClient } from "../../../../client/client.js";

export type MultiStepAuthProviderType = {
  strategy: "email";
  email: string;
};
export type PreAuthArgsType = MultiStepAuthProviderType & {
  client: ThirdwebClient;
};

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
