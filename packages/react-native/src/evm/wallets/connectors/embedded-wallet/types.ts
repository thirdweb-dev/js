import { Chain } from "@thirdweb-dev/chains";
import {
  AuthProvider,
  RecoveryShareManagement,
  UserWalletStatus,
  WalletOptions,
} from "@thirdweb-dev/wallets";

export type OauthOptions = {
  providers: AuthProvider[];
  redirectUrl: string;
};

export type OauthOption = {
  provider: AuthProvider;
  redirectUrl: string;
};

export interface EmbeddedConnectorOptions {
  chains?: Chain[];
  chainId?: number;
  email?: string;
  phoneNumber?: string;
}

export type EmbeddedWalletOptions = Omit<
  WalletOptions<EmbeddedConnectorOptions>,
  "clientId"
>;

type EmbeddedAdvanceOptions = {
  recoveryShareManagement?: RecoveryShareManagement;
};

export interface EmbeddedWalletConnectorOptions {
  clientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
  chains: Chain[];
  advancedOptions?: EmbeddedAdvanceOptions;
}

export interface AuthOptions {
  jwt: string;
  password: string;
}

export type SendEmailOtpReturnType = {
  isNewUser: boolean;
  isNewDevice: boolean;
  recoveryShareManagement: RecoveryShareManagement;
};

export type EmbeddedWalletConnectionArgs = {
  chainId?: number;
  authResult: AuthResult;
};

type EmailOtpAuthParams = {
  strategy: "email_otp";
  email: string;
  otp: string;
  recoveryCode?: string;
};

type GoogleAuthParams = {
  strategy: "google";
  redirectUrl: string;
};

type JwtAuthParams = {
  strategy: "jwt";
  jwt: string;
  encryptionKey?: string;
};

// this is the input to 'authenticate'
export type AuthParams = EmailOtpAuthParams | GoogleAuthParams | JwtAuthParams;

// TODO typed based off AuthParams["strategy"]
export type AuthResult = {
  user?: InitializedUser;
  isNewUser?: boolean;
  needsRecoveryCode?: boolean;
};

export type InitializedUser = {
  status: UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED;
  recoveryShareManagement: RecoveryShareManagement;
};

export type VerifiedTokenResponse = {
  verifiedToken: {
    jwtToken: string;
    authProvider: AuthProvider;
    developerClientId: string;
    authDetails: {
      email?: string;
      userWalletId: string;
      recoveryCode?: string;
      cookieString?: string;
      recoveryShareManagement: RecoveryShareManagement;
    };
    isNewUser: boolean;
  };
  verifiedTokenJwtString: string;
};
