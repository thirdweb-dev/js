import type {
  Chain,
  CustomizationOptionsType,
} from "@paperxyz/sdk-common-utilities";
import type { EmbeddedWallet } from "../../lib/core/embedded-wallet";
import type { EmbeddedWalletIframeCommunicator } from "../../utils/iFrameCommunication/EmbeddedWalletIframeCommunicator";
import { RecoveryShareManagement } from "../auth";

// Class constructor types
// types for class constructors still a little messy right now.
// Open to PRs from whoever sees this and knows of a cleaner way to handle things
export type ClientIdConstructorType = { clientId: string };
export type EmbeddedWalletConstructorType = ClientIdConstructorType & {
  chain: Chain;
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
  recoveryCode?: string;
};

export type InitializedUser = {
  status: UserStatus.LOGGED_IN_WALLET_INITIALIZED;
  wallet: EmbeddedWallet;
  walletAddress: string;
  authDetails: AuthDetails;
};

// Embedded Wallet Types
export enum UserStatus {
  LOGGED_OUT = "Logged Out",
  LOGGED_IN_WALLET_INITIALIZED = "Logged In, Wallet Initialized",
}
export enum UserWalletStatus {
  LOGGED_OUT = "Logged Out",
  LOGGED_IN_WALLET_UNINITIALIZED = "Logged In, Wallet Uninitialized",
  LOGGED_IN_NEW_DEVICE = "Logged In, New Device",
  LOGGED_IN_WALLET_INITIALIZED = "Logged In, Wallet Initialized",
}

export type WalletAddressObjectType = {
  walletAddress: string;
};

export type SetUpWalletRpcReturnType = WalletAddressObjectType & {
  deviceShareStored: string;
  isIframeStorageEnabled: boolean;
};

export type SendEmailOtpReturnType = {
  isNewUser: boolean;
  isNewDevice: boolean;
  recoveryShareManagement: RecoveryShareManagement;
};
export type LogoutReturnType = { success: boolean };
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
export type GetUserWalletStatusFnReturnType =
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
      user: Omit<InitializedUser, "status">;
    };

// This is returned from the getUser method in PaperEmbeddedWalletSdk
export type GetUser =
  | {
      status: UserStatus.LOGGED_OUT;
    }
  | InitializedUser;
