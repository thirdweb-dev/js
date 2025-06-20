import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Address } from "../../../../utils/address.js";
import type { Account, Wallet } from "../../../interfaces/wallet.js";
import type { AuthOption, OAuthOption } from "../../../types.js";
import type { Ecosystem } from "../wallet/types.js";

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

export type SocialAuthArgsType = {
  strategy: OAuthOption;
  openedWindow?: Window;
  closeOpenedWindow?: (window: Window) => void;
  redirectUrl?: string;
  mode?: "redirect" | "popup" | "window";
};

export type SingleStepAuthArgsType =
  | SocialAuthArgsType
  | { strategy: "jwt"; jwt: string; encryptionKey?: string }
  | { strategy: "auth_endpoint"; payload: string; encryptionKey?: string }
  | {
      /**
       * @deprecated
       */
      strategy: "iframe_email_verification";
      email: string;
    }
  | {
      /**
       * @deprecated
       */
      strategy: "iframe";
    }
  | {
      strategy: "passkey";
      /**
       * Whether to create a new passkey (sign up) or login to an existing one (sign in).
       * You can use `hasStoredPasskey()` to check if a user has previously logged in with a passkey on this device.
       */
      type: "sign-up" | "sign-in";
      /**
       * Optional name of the passkey to create, defaults to a generated name
       */
      passkeyName?: string;
      /**
       * Whether to store the last used passkey from local storage.
       * This is useful if you want to automatically log in the user with their last used passkey.
       * Defaults to true.
       */
      storeLastUsedPasskey?: boolean;
    }
  | {
      strategy: "wallet";
      wallet: Wallet;
      chain: Chain;
    }
  | {
      strategy: "guest";
    }
  | {
      strategy: "backend";
      walletSecret: string;
    };

export type AuthArgsType = (MultiStepAuthArgsType | SingleStepAuthArgsType) & {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
};

// TODO: remove usage of enums, instead use object with as const
type RecoveryShareManagement = "USER_MANAGED" | "AWS_MANAGED" | "ENCLAVE";

// TODO: remove usage of enums, instead use object with as const
export type AuthProvider =
  | "Cognito"
  | "Guest"
  | "Backend"
  | "Google"
  | "EmailOtp"
  | "CustomJWT"
  | "CustomAuthEndpoint"
  | "Facebook"
  | "Apple"
  | "Passkey"
  | "Discord"
  | "Coinbase"
  | "X"
  | "Line"
  | "Twitch"
  | "Steam"
  | "GitHub"
  | "Farcaster"
  | "Telegram";

export type OAuthRedirectObject = {
  strategy: OAuthOption;
  redirectUrl: string;
};

// TODO: type this better for each auth provider
export type Profile = {
  type: AuthOption;
  details: {
    id?: string;
    email?: string;
    phone?: string;
    address?: Address;
  };
};

export type UserDetailsApiType = {
  status: string;
  isNewUser: boolean;
  walletUserId: string;
  walletAddress: string;
} & AuthStoredTokenWithCookieReturnType;

// TODO: Clean up tech debt of random type Objects
// E.g. StoredTokenType is really not used anywhere but it exists as this object for legacy reason
type StoredTokenType = {
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
  // Will just be WalletAddressObjectType for enclave wallets
  walletDetails: SetUpWalletRpcReturnType | WalletAddressObjectType;
};

export type AuthResultAndRecoveryCode = AuthStoredTokenWithCookieReturnType & {
  deviceShareStored?: string;
  encryptionKey?: string;
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
  walletType?: "sharded" | "enclave";
};

type InitializedUser = {
  status: "Logged In, Wallet Initialized";
  walletAddress: string;
  authDetails: AuthDetails;
  account: Account; // TODO (rn) this doesn't feel right here, should access it from the connector
};

// In App Wallet Types

type WalletAddressObjectType = {
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

// ! Types seem repetitive, but the name should identify which goes where
// this is the return type from the InAppWallet Class getUserWalletStatus method iframe call
export type GetUserWalletStatusRpcReturnType =
  | {
      status: "Logged Out";
      user: undefined;
    }
  | {
      status: "Logged In, Wallet Uninitialized";
      user: { authDetails: AuthDetails };
    }
  | {
      status: "Logged In, New Device";
      user: { authDetails: AuthDetails; walletAddress: string };
    }
  | {
      status: "Logged In, Wallet Initialized";
      user: Omit<InitializedUser, "account" | "status">;
    };

// this is the return type from the InAppWallet Class getUserWalletStatus method
export type GetUser =
  | {
      status: "Logged Out";
    }
  | {
      status: "Logged In, Wallet Uninitialized";
      authDetails: AuthDetails;
    }
  | {
      status: "Logged In, New Device";
      authDetails: AuthDetails;
      walletAddress: string;
    }
  | InitializedUser;

export type GetAuthenticatedUserParams = {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
};

export type UnlinkParams = {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  profileToUnlink: Profile;
  allowAccountDeletion?: boolean;
};
