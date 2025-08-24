import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Address } from "../../../../utils/address.js";
import type { Account, Wallet } from "../../../interfaces/wallet.js";
import type { OAuthOption } from "../../../types.js";
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
  | "TikTok"
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

// Provider-specific profile types based on auth provider
export type GoogleProfile = {
  type: "google";
  details: {
    email: string;
    emailVerified: boolean;
    familyName?: string;
    givenName?: string;
    hd: string;
    id: string;
    locale: string;
    name?: string;
    picture: string;
  };
};

export type FacebookProfile = {
  type: "facebook";
  details: {
    email?: string;
    firstName?: string;
    id: string;
    lastName?: string;
    name?: string;
    picture?: string;
  };
};

export type AppleProfile = {
  type: "apple";
  details: {
    email?: string;
    emailVerified: boolean;
    id: string;
    isPrivateEmail: boolean;
  };
};

export type GitHubProfile = {
  type: "github";
  details: {
    avatar?: string | null;
    id: string;
    name?: string | null;
    username: string;
  };
};

export type DiscordProfile = {
  type: "discord";
  details: {
    avatar: string;
    email?: string;
    emailVerified: boolean;
    id: string;
    username: string;
  };
};

export type CoinbaseProfile = {
  type: "coinbase";
  details: {
    avatar?: string;
    id: string;
    name: string;
  };
};

export type XProfile = {
  type: "x";
  details: {
    id: string;
    name: string;
    username: string;
    profileImageUrl?: string;
  };
};

export type SteamProfile = {
  type: "steam";
  details: {
    avatar?: string;
    id: string;
    metadata: {
      avatar: {
        large?: string;
        medium?: string;
        small?: string;
      };
      personaname?: string;
      profileurl?: string;
      realname?: string;
    };
    username?: string;
  };
};

export type TelegramProfile = {
  type: "telegram";
  details: {
    firstName?: string;
    id: string;
    lastName?: string;
    picture?: string;
    username?: string;
  };
};

export type TwitchProfile = {
  type: "twitch";
  details: {
    avatar?: string;
    description?: string;
    email?: string;
    id: string;
    username: string;
  };
};

export type LineProfile = {
  type: "line";
  details: {
    avatar?: string;
    id: string;
    username?: string;
  };
};

export type FarcasterProfile = {
  type: "farcaster";
  details: {
    fid: string;
    id: string;
    walletAddress?: string;
  };
};

export type PasskeyProfile = {
  type: "passkey";
  details: {
    algorithm: string;
    credentialId: string;
    publicKey: string;
  };
};

export type EmailProfile = {
  type: "email";
  details: {
    email: string;
    id: string;
  };
};

export type PhoneProfile = {
  type: "phone";
  details: {
    id: string;
    phone: string;
  };
};

export type GuestProfile = {
  type: "guest";
  details: {
    id: string;
  };
};

export type BackendProfile = {
  type: "backend";
  details: {
    id: string;
  };
};

// Additional types from Zod schemas that may be used
export type SiweProfile = {
  type: "siwe";
  details: {
    id: string;
    walletAddress: string;
  };
};

export type PreGenerationProfile = {
  type: "pre_generation";
  details: {
    id: string;
    pregeneratedIdentifier: string;
  };
};

export type ServerProfile = {
  type: "server";
  details: {
    identifier: string;
  };
};

export type CustomJwtProfile = {
  type: "custom_jwt";
  details: {
    authProviderId?: string;
    email?: string;
    id: string;
    phone?: string;
    walletAddress?: string;
  };
};

export type CustomAuthEndpointProfile = {
  type: "custom_auth_endpoint";
  details: {
    authProviderId?: string;
    email?: string;
    id: string;
    phone?: string;
    walletAddress?: string;
  };
};

// For wallet auth (maps to existing "wallet" AuthOption)
export type WalletProfile = {
  type: "wallet";
  details: {
    id: string;
    address: Address;
  };
};

// TikTok profile (present in authOptions but not in Zod schemas)
export type TikTokProfile = {
  type: "tiktok";
  details: {
    id: string;
    // Add more fields as needed when TikTok provider is implemented
  };
};

// Discriminated union of all profile types
export type Profile =
  | GoogleProfile
  | FacebookProfile
  | AppleProfile
  | GitHubProfile
  | DiscordProfile
  | CoinbaseProfile
  | XProfile
  | SteamProfile
  | TelegramProfile
  | TwitchProfile
  | LineProfile
  | FarcasterProfile
  | PasskeyProfile
  | EmailProfile
  | PhoneProfile
  | GuestProfile
  | BackendProfile
  | WalletProfile
  | TikTokProfile
  // Additional types that may be used in the future
  | SiweProfile
  | PreGenerationProfile
  | ServerProfile
  | CustomJwtProfile
  | CustomAuthEndpointProfile;

// Utility functions to safely access profile properties
export function getProfileEmail(profile: Profile): string | undefined {
  if ('email' in profile.details) {
    return profile.details.email;
  }
  return undefined;
}

export function getProfilePhone(profile: Profile): string | undefined {
  if ('phone' in profile.details) {
    return profile.details.phone;
  }
  return undefined;
}

export function getProfileAddress(profile: Profile): Address | undefined {
  if ('address' in profile.details) {
    return profile.details.address;
  }
  if ('walletAddress' in profile.details) {
    return profile.details.walletAddress as Address;
  }
  return undefined;
}

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
