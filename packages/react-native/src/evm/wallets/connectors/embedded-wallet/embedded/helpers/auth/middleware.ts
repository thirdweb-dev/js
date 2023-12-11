import {
  AuthProvider,
  AuthStoredTokenWithCookieReturnType,
  RecoveryShareManagement,
} from "@thirdweb-dev/wallets";
import {
  getDeviceShare,
  setAuthTokenClient,
  setWallerUserDetails,
} from "../storage/local";
import { setUpNewUserWallet } from "../wallet/creation";
import { getCognitoRecoveryPassword } from "../wallet/recoveryCode";
import { setUpShareForNewDevice } from "../wallet/retrieval";
import { ErrorMessages } from "../errors";

export async function prePaperAuth(args: {
  authenticationMethod: AuthProvider;
  email: string;
}) {
  // TODO: Add tracking here
  Promise.resolve(args);
}

export async function postPaperAuth({
  storedToken,
  clientId,
  recoveryCode,
}: {
  storedToken: AuthStoredTokenWithCookieReturnType["storedToken"];
  clientId: string;
  recoveryCode?: string;
}) {
  if (storedToken.shouldStoreCookieString) {
    await setAuthTokenClient(storedToken.cookieString, clientId);
  }

  await setWallerUserDetails({
    clientId,
    userId: storedToken.authDetails.userWalletId,
    email: storedToken.authDetails.email,
  });

  if (storedToken.isNewUser) {
    const _recoveryCode = await getRecoveryCode(
      storedToken,
      clientId,
      recoveryCode,
    );
    if (!_recoveryCode) {
      throw new Error(ErrorMessages.missingRecoveryCode);
    }
    await setUpNewUserWallet(_recoveryCode, clientId);
  } else {
    try {
      // existing device share
      await getDeviceShare(clientId);
    } catch (e) {
      const _recoveryCode = await getRecoveryCode(
        storedToken,
        clientId,
        recoveryCode,
      );
      if (!_recoveryCode) {
        throw new Error(ErrorMessages.missingRecoveryCode);
      }
      try {
        await setUpShareForNewDevice({
          clientId,
          recoveryCode: _recoveryCode,
        });
      } catch (error) {
        console.error("Error setting up wallet on device", error);
        throw error;
      }
    }
  }

  return storedToken;
}

export async function postPaperAuthUserManaged(
  storedToken: AuthStoredTokenWithCookieReturnType["storedToken"],
  clientId: string,
  password: string,
) {
  const _password = await getRecoveryCode(storedToken, clientId, password);

  if (storedToken.shouldStoreCookieString) {
    await setAuthTokenClient(storedToken.cookieString, clientId);
  }

  await setWallerUserDetails({
    clientId,
    userId: storedToken.authDetails.userWalletId,
    email: storedToken.authDetails.email,
  });

  if (storedToken.isNewUser) {
    await setUpNewUserWallet(_password, clientId);
  } else {
    try {
      // existing device share
      await getDeviceShare(clientId);
    } catch (e) {
      // trying to recreate device share from recovery code to derive wallet
      try {
        await setUpShareForNewDevice({
          clientId,
          recoveryCode: _password,
        });
      } catch (error) {
        console.error("Error setting up wallet on device", error);
        throw error;
      }
    }
  }

  return storedToken;
}

async function getRecoveryCode(
  storedToken: AuthStoredTokenWithCookieReturnType["storedToken"],
  clientId: string,
  recoveryCode?: string,
): Promise<string> {
  if (
    storedToken.authDetails.recoveryShareManagement ===
    RecoveryShareManagement.CLOUD_MANAGED
  ) {
    if (storedToken.authProvider === AuthProvider.CUSTOM_JWT) {
      if (!recoveryCode) {
        throw new Error(
          `GetRecoveryCode error: ${ErrorMessages.missingRecoveryCode}`,
        );
      }
      return recoveryCode;
    } else {
      try {
        const code = await getCognitoRecoveryPassword(clientId);
        return code;
      } catch (e) {
        throw new Error("Something went wrong getting cognito recovery code");
      }
    }
  } else if (
    storedToken.authDetails.recoveryShareManagement ===
    RecoveryShareManagement.USER_MANAGED
  ) {
    if (recoveryCode) {
      return recoveryCode;
    }
    throw new Error(ErrorMessages.missingRecoveryCode);
  } else {
    throw new Error("Invalid recovery share management option");
  }
}
