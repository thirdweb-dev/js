import type {
  AuthDetails,
  InitializedUser,
  SetUpWalletRpcReturnType,
} from "./EmbeddedWallets/EmbeddedWallets";

export enum RecoveryShareManagement {
  USER_MANAGED = "USER_MANAGED",
  KMS_MANAGED = "KMS_MANAGED",
}

export enum AuthProvider {
  PAPER_EMAIL_OTP = "PaperEmailOTP",
  GOOGLE = "Google",
  TWITTER = "Twitter",
  COGNITO = "Cognito",
  AUTH0 = "Auth0",
  CUSTOM_JWT = "CustomJWT",
}

export type GetSocialLoginClientIdReturnType = {
  clientId: string;
};

// TODO: Clean up tech debt of random type Objects
// E.g. StoredTokenType is really not used anywhere but it exists as this object for legacy reason
export type StoredTokenType = {
  jwtToken: string;
  authProvider: AuthProvider;
  authDetails: AuthDetails;
  developerClientId: string;
};

export type AuthStoredTokenWithCookieReturnType = {
  storedToken: StoredTokenType & {
    cookieString: string;
    shouldStoreCookieString: boolean;
    isNewUser: boolean;
  };
};
export type AuthAndWalletRpcReturnType = AuthStoredTokenWithCookieReturnType & {
  walletDetails: SetUpWalletRpcReturnType;
};

export type AuthLoginReturnType = { user: InitializedUser };
