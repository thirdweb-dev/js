import type { ThirdwebClient } from "../../../../client/client.js";

// 2 Step Auth Flow Type
export type InitiateAuthType = "auth" | "2fa" | "link";
export type MultiStepAuthProviderType = {
  provider: "email";
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
      provider: "google";
      googleOauthPrompt?: "select_account" | "none" | "consent";
    }
  | { provider: "apple" }
  | { provider: "facebook" }
  | { provider: "jwt"; jwt: string; encryptionKey: string }
  | { provider: "auth_endpoint"; payload: string; encryptionKey: string }
  | { provider: "iframe_email_verification"; email: string }
  | { provider: "iframe" };

export type AuthArgsType = (MultiStepAuthArgsType | SingleStepAuthArgsType) & {
  client: ThirdwebClient;
};
