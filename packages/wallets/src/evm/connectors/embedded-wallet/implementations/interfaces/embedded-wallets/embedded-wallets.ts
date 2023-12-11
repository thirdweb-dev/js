import type {
  Chain,
  CustomizationOptionsType,
} from "@paperxyz/sdk-common-utilities";
import type { EmbeddedWallet } from "../../lib/core/embedded-wallet";
import type { EmbeddedWalletIframeCommunicator } from "../../utils/iFrameCommunication/EmbeddedWalletIframeCommunicator";
import { AuthAndWalletRpcReturnType, RecoveryShareManagement } from "../auth";

// Class constructor types
// types for class constructors still a little messy right now.
// Open to PRs from whoever sees this and knows of a cleaner way to handle things
export type ClientIdConstructorType = {
  /**
   * the clientId found on the dashboard settings {@link https://thirdweb.com/dashboard/settings}
   */
  clientId: string;
};
export type EmbeddedWalletConstructorType = ClientIdConstructorType & {
  /**
   * sets the default chain that the EmbeddedWallet will live on.
   */
  chain: Chain;
  /**
   * @param authResult - the authResult returned from the EmbeddedWalletSdk auth method
   * @returns
   */
  onAuthSuccess?: (authResult: AuthAndWalletRpcReturnType) => void;
  /**
   * sets the default style override for any modal that pops up asking for user's details when creating wallet or logging in.
   */
  styles?: CustomizationOptionsType;
};

export type ClientIdWithQuerierType = ClientIdConstructorType & {
  querier: EmbeddedWalletIframeCommunicator<any>;
};
export type ClientIdWithQuerierAndChainType = ClientIdWithQuerierType & {
  chain: Chain;
};

// Auth Types
export type AuthDetails = {
  email?: string;
  userWalletId: string;
  encryptionKey?: string;
  backupRecoveryCodes?: string[];
  recoveryShareManagement: RecoveryShareManagement;
};

export type InitializedUser = {
  status: UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED;
  wallet: EmbeddedWallet;
  walletAddress: string;
  authDetails: AuthDetails;
};

// Embedded Wallet Types
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
// this is the return type from the EmbeddedWallet Class getUserWalletStatus method iframe call
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
      user: Omit<InitializedUser, "wallet" | "status">;
    };

// this is the return type from the EmbeddedWallet Class getUserWalletStatus method
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
