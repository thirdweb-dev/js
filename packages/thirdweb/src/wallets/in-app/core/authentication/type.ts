import type { AuthType } from "@passwordless-id/webauthn/dist/esm/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Account } from "../../../interfaces/wallet.js";
import type { SocialAuthOption } from "../../../types.js";
import type { Ecosystem } from "../../web/types.js";

export type MultiStepAuthProviderType =
  | {
      strategy: "email";
      email: string;
    }
  | {
      strategy: "phone";
      phoneNumber: string;
    };
export type PreAuthArgsType = MultiStepAuthProviderType & {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
};

export type MultiStepAuthArgsType = MultiStepAuthProviderType & {
  verificationCode: string;
};

export type SingleStepAuthArgsType =
  | {
      strategy: SocialAuthOption;
      openedWindow?: Window;
      closeOpenedWindow?: (window: Window) => void;
      redirectUrl?: string;
    }
  | { strategy: "jwt"; jwt: string; encryptionKey: string }
  | { strategy: "auth_endpoint"; payload: string; encryptionKey: string }
  | { strategy: "iframe_email_verification"; email: string }
  | { strategy: "iframe" }
  | {
      strategy: "passkey";
      type: "sign-up" | "sign-in";
      passkeyName?: string;
      authenticatorType?: AuthType;
    };

export type AuthArgsType = (MultiStepAuthArgsType | SingleStepAuthArgsType) & {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
};

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

export type OauthOption = {
  provider: AuthProvider;
  redirectUrl: string;
};

/**
 * @internal
 */
export type GetHeadlessLoginLinkReturnType = {
  loginLink: string;
};

export type UserDetailsApiType = {
  status: string;
  isNewUser: boolean;
  walletUserId: string;
  walletAddress: string;
} & AuthStoredTokenWithCookieReturnType;

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

// Auth Types
export type AuthDetails = (
  | {
      email?: string;
    }
  | {
      phoneNumber?: string;
    }
) & {
  userWalletId: string;
  encryptionKey?: string;
  backupRecoveryCodes?: string[];
  recoveryShareManagement: RecoveryShareManagement;
};

export type InitializedUser = {
  status: UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED;
  walletAddress: string;
  authDetails: AuthDetails;
  account: Account; // TODO (rn) this doesn't feel right here, should access it from the connector
};

// In APp Wallet Types
export enum UserWalletStatus {
  LOGGED_OUT = "Logged Out",
  LOGGED_IN_WALLET_UNINITIALIZED = "Logged In, Wallet Uninitialized",
  LOGGED_IN_NEW_DEVICE = "Logged In, New Device",
  LOGGED_IN_WALLET_INITIALIZED = "Logged In, Wallet Initialized",
}

export type WalletAddressObjectType = {
  /**
   * User's wallet address
   */
  walletAddress: string;
};

export type SetUpWalletRpcReturnType = WalletAddressObjectType & {
  /**
   * the value that is saved for the user's device share.
   * We save this into the localStorage on the site itself if we could not save it within the iframe's localStorage.
   * This happens in incognito mostly
   */
  deviceShareStored: string;
  /**
   * Tells us if we were able to store values in the localStorage in our iframe.
   * We need to store it under the dev's domain localStorage if we weren't able to store things in the iframe
   */
  isIframeStorageEnabled: boolean;
};

export type SendEmailOtpReturnType = {
  isNewUser: boolean;
  isNewDevice: boolean;
  recoveryShareManagement: RecoveryShareManagement;
};
export type LogoutReturnType = { success: boolean };

/**
 * @internal
 */
export type GetAuthDetailsReturnType = { authDetails?: AuthDetails };

// ! Types seem repetitive, but the name should identify which goes where
// this is the return type from the InAppWallet Class getUserWalletStatus method iframe call
export type GetUserWalletStatusRpcReturnType =
  | {
      status: UserWalletStatus.LOGGED_OUT;
      user: undefined;
    }
  | {
      status: UserWalletStatus.LOGGED_IN_WALLET_UNINITIALIZED;
      user: { authDetails: AuthDetails };
    }
  | {
      status: UserWalletStatus.LOGGED_IN_NEW_DEVICE;
      user: { authDetails: AuthDetails; walletAddress: string };
    }
  | {
      status: UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED;
      user: Omit<InitializedUser, "account" | "status">;
    };

// this is the return type from the InAppWallet Class getUserWalletStatus method
export type GetUser =
  | {
      status: UserWalletStatus.LOGGED_OUT;
    }
  | {
      status: UserWalletStatus.LOGGED_IN_WALLET_UNINITIALIZED;
      authDetails: AuthDetails;
    }
  | {
      status: UserWalletStatus.LOGGED_IN_NEW_DEVICE;
      authDetails: AuthDetails;
      walletAddress: string;
    }
  | InitializedUser;

export type GetAuthenticatedUserParams = {
  client: ThirdwebClient;
};

export const oauthStrategyToAuthProvider: Record<
  "google" | "facebook" | "apple",
  AuthProvider
> = {
  google: AuthProvider.GOOGLE,
  facebook: AuthProvider.FACEBOOK,
  apple: AuthProvider.APPLE,
};
