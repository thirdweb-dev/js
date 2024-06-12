import type { ThirdwebClient } from "../../../../../client/client.js";
import {
  AuthProvider,
  type AuthStoredTokenWithCookieReturnType,
  RecoveryShareManagement,
} from "../../../core/authentication/type.js";
import { ErrorMessages } from "../errors.js";
import {
  getDeviceShare,
  setAuthTokenClient,
  setWallerUserDetails,
} from "../storage/local.js";
import { setUpNewUserWallet } from "../wallet/creation.js";
import { getCognitoRecoveryPassword } from "../wallet/recoveryCode.js";
import { setUpShareForNewDevice } from "../wallet/retrieval.js";

export async function preAuth(args: {
  authenticationMethod: AuthProvider;
  email?: string;
  phone?: string;
}) {
  // TODO: Add tracking here
  Promise.resolve(args);
}

export async function postAuth({
  storedToken,
  client,
  recoveryCode,
}: {
  storedToken: AuthStoredTokenWithCookieReturnType["storedToken"];
  client: ThirdwebClient;
  recoveryCode?: string;
}) {
  if (storedToken.shouldStoreCookieString) {
    await setAuthTokenClient(storedToken.cookieString, client.clientId);
  }

  await setWallerUserDetails({
    clientId: client.clientId,
    userId: storedToken.authDetails.userWalletId,
    email:
      "email" in storedToken.authDetails
        ? storedToken.authDetails.email
        : undefined, // TODO (rn) store phone number too?
  });

  if (storedToken.isNewUser) {
    const _recoveryCode = await getRecoveryCode(
      storedToken,
      client,
      recoveryCode,
    );
    if (!_recoveryCode) {
      throw new Error(ErrorMessages.missingRecoveryCode);
    }
    await setUpNewUserWallet(_recoveryCode, client);
  } else {
    try {
      // existing device share
      await getDeviceShare(client.clientId);
    } catch (e) {
      const _recoveryCode = await getRecoveryCode(
        storedToken,
        client,
        recoveryCode,
      );
      if (!_recoveryCode) {
        throw new Error(ErrorMessages.missingRecoveryCode);
      }
      try {
        await setUpShareForNewDevice({
          client: client,
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

export async function postAuthUserManaged(
  storedToken: AuthStoredTokenWithCookieReturnType["storedToken"],
  client: ThirdwebClient,
  password: string,
) {
  const _password = await getRecoveryCode(storedToken, client, password);

  if (storedToken.shouldStoreCookieString) {
    await setAuthTokenClient(storedToken.cookieString, client.clientId);
  }

  await setWallerUserDetails({
    clientId: client.clientId,
    userId: storedToken.authDetails.userWalletId,
    email:
      "email" in storedToken.authDetails
        ? storedToken.authDetails.email
        : undefined, // TODO (rn) store phone number too?
  });

  if (storedToken.isNewUser) {
    await setUpNewUserWallet(_password, client);
  } else {
    try {
      // existing device share
      await getDeviceShare(client.clientId);
    } catch (e) {
      // trying to recreate device share from recovery code to derive wallet
      try {
        await setUpShareForNewDevice({
          client,
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
  client: ThirdwebClient,
  recoveryCode?: string,
): Promise<string> {
  if (
    storedToken.authDetails.recoveryShareManagement ===
    RecoveryShareManagement.CLOUD_MANAGED
  ) {
    if (
      storedToken.authProvider === AuthProvider.CUSTOM_JWT ||
      storedToken.authProvider === AuthProvider.CUSTOM_AUTH_ENDPOINT
    ) {
      if (!recoveryCode) {
        throw new Error(
          `GetRecoveryCode error: ${ErrorMessages.missingRecoveryCode}`,
        );
      }
      return recoveryCode;
    } else {
      try {
        const code = await getCognitoRecoveryPassword(client);
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
