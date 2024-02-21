import type { ThirdwebClient } from "../../../../client/client.js";

// Oauth User Types
export type DiscordUserType = {
  id: string;
  username: string;
  avatar: string;
  verified: boolean;
  email: string;
};

export type DiscordAuthDetailsType = {
  type: "discord";
} & DiscordUserType;

export type GoogleUserType = {
  sub: string;
  email: string;
  email_verified: boolean;
  family_name?: string;
  given_name?: string;
  name?: string;
  locale: string;
  picture: string;
  hd: string;
};

export type GoogleAuthDetailsType = {
  type: "google";
} & GoogleUserType;

export type EmailUserType = {
  email: string;
};

export type EmailAuthDetailsType = {
  type: "email";
} & EmailUserType;

export type AuthProviderDetailType =
  | DiscordAuthDetailsType
  | GoogleAuthDetailsType
  | EmailAuthDetailsType;

// Auth Storage Type
export type AuthTokenStorageType = {
  fetchToken: ({
    key,
  }: {
    key: string;
  }) => string | undefined | Promise<string | undefined>;
  storeToken: ({
    key,
    value,
  }: {
    key: string;
    value: string;
  }) => void | Promise<void>;
  removeToken: ({ key }: { key: string }) => void | Promise<void>;
};

// 2 Step Auth Flow Type
export type InitiateAuthType = "auth" | "2fa" | "link";
export type MultiStepAuthProviderType = {
  provider: "email";
  email: string;
};
export type InitiateAuthArgsType = MultiStepAuthProviderType & {
  client: ThirdwebClient;
};
export type InitiateAuthResultType = {
  initiationType: InitiateAuthType;
} & MultiStepAuthProviderType;

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
  storage: AuthTokenStorageType;
  client: ThirdwebClient;
  config?: {
    autoLinkAccount?: boolean;
  };
};

// Authentication Results type
export type AuthMethodType =
  | "google"
  | "email"
  | "apple"
  | "facebook"
  | "other";
export type AuthStageType = "READY_TO_LOAD" | "NEEDS_2FA";
export type AuthLevelType = "BASIC" | "2FA";

export type AuthUserType = {
  stage: AuthStageType;
  authLevel: AuthLevelType;
  authMethod: AuthMethodType;
  userDetails: {
    userId: string;
    linkedAccounts: AuthMethodType[];
  };
  accounts: AuthProviderDetailType[];
  authToken: string;
};

// Authentication Linking Type
export type LinkAuthArgsType = AuthArgsType & {
  authUser: AuthUserType;
  config?: never;
};
