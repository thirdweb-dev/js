import type { ThirdwebClient } from "../../../client/client.js";

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

export type AuthDetailType =
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
export type MultiStepAuthProviderType =
  | {
      provider: "email";
      email: string;
    }
  | {
      provider: "phone";
      phone: string;
    };
export type InitiateAuthArgsType = MultiStepAuthProviderType & {
  client: ThirdwebClient;
};
export type InitiateAuthResultType = {
  initiationType: InitiateAuthType;
} & MultiStepAuthProviderType;

// General Auth Flow Type
export type MultiStepAuthArgsType = MultiStepAuthProviderType & {
  code: string;
};
export type SingleStepAuthArgsType =
  | {
      provider: "google";
      googleOauthPrompt?: "select_account" | "none" | "consent";
    }
  | { provider: "discord" };

export type AuthArgsType = (MultiStepAuthArgsType | SingleStepAuthArgsType) & {
  storage: AuthTokenStorageType;
  client: ThirdwebClient;
  config?: {
    autoLinkAccount?: boolean;
  };
};

// Authentication Results type
export type AuthMethodType = "discord" | "google" | "email" | "phone";
export type AuthStageType = "READY_TO_LOAD" | "NEEDS_2FA";
export type AuthLevelType = "BASIC" | "2FA";

export type AuthUserType = {
  stage: AuthStageType;
  authLevel: AuthLevelType;
  authMethod: AuthMethodType;
  userDetails: {
    userId: string;
    linkedAccounts: AuthMethodType[];
    email?: string;
    phone?: string;
    walletAddress?: string;
  };
  accounts: {
    discord?: DiscordAuthDetailsType;
    google?: GoogleAuthDetailsType;
    email?: EmailAuthDetailsType;
  };
  authToken: string;
};

// Authentication Linking Type
export type LinkAuthConflictType =
  | "error"
  | "override_current_account"
  | "override_linked_account"
  | "merge";
export type LinkAuthArgsType = Omit<AuthArgsType, "config"> & {
  onConflict: LinkAuthConflictType;
};
