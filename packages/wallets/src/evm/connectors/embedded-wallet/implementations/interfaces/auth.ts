import type {
  AuthDetails,
  InitializedUser,
  SetUpWalletRpcReturnType,
} from "./embedded-wallets/embedded-wallets";

export enum RecoveryShareManagement {
  USER_MANAGED = "USER_MANAGED",
  AWS_MANAGED = "AWS_MANAGED",
}

export enum AuthProvider {
  COGNITO = "Cognito",
}

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
