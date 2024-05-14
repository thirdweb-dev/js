import type {
  AuthDetails,
  InitializedUser,
  SetUpWalletRpcReturnType,
} from "./in-app-wallets/in-app-wallets.js";

// TODO: remove usage of enums, instead use object with as const
export enum RecoveryShareManagement {
  USER_MANAGED = "USER_MANAGED",
  CLOUD_MANAGED = "AWS_MANAGED",
}

// TODO: remove usage of enums, instead use object with as const
export enum AuthProvider {
  COGNITO = "Cognito",
  GOOGLE = "Google",
  EMAIL_OTP = "EmailOtp",
  CUSTOM_JWT = "CustomJWT",
  CUSTOM_AUTH_ENDPOINT = "CustomAuthEndpoint",
  FACEBOOK = "Facebook",
  APPLE = "Apple",
  PASSKEY = "Passkey",
}

/**
 * @internal
 */
export type GetHeadlessLoginLinkReturnType = {
  loginLink: string;
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
