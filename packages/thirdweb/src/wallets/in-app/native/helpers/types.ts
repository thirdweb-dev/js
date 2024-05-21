import type {
  AuthProvider,
  RecoveryShareManagement,
} from "../../core/authentication/type.js";

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

export type IsValidUserManagedEmailOTPResponse = {
  isValid: { type: "boolean" };
};
