import type { ThirdwebClient } from "../../../../../client/client.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import type { AuthStoredTokenWithCookieReturnType } from "../../../core/authentication/types.js";
import { ErrorMessages } from "../errors.js";
import { getDeviceShare, setWallerUserDetails } from "../storage/local.js";
import { setUpNewUserWallet } from "../wallet/creation.js";
import {
  getCognitoRecoveryPasswordV1,
  getCognitoRecoveryPasswordV2,
} from "../wallet/recoveryCode.js";
import { setUpShareForNewDevice } from "../wallet/retrieval.js";

export async function postAuth({
  storedToken,
  client,
  recoveryCode,
  storage,
}: {
  storedToken: AuthStoredTokenWithCookieReturnType["storedToken"];
  client: ThirdwebClient;
  recoveryCode?: string;
  storage: ClientScopedStorage;
}) {
  if (storedToken.shouldStoreCookieString) {
    await storage.saveAuthCookie(storedToken.cookieString);
  }

  await setWallerUserDetails({
    clientId: client.clientId,
    userId: storedToken.authDetails.userWalletId,
    email:
      "email" in storedToken.authDetails
        ? storedToken.authDetails.email
        : "phoneNumber" in storedToken.authDetails
          ? storedToken.authDetails.phoneNumber
          : undefined,
  });

  if (storedToken.isNewUser) {
    const _recoveryCode = await getRecoveryCode({
      storedToken,
      client,
      recoveryCode,
      storage,
    });
    if (!_recoveryCode) {
      throw new Error(ErrorMessages.missingRecoveryCode);
    }
    await setUpNewUserWallet({
      client,
      recoveryCode: _recoveryCode,
      storage,
    });
  } else {
    try {
      // existing device share
      await getDeviceShare(client.clientId);
    } catch {
      const _recoveryCode = await getRecoveryCode({
        storedToken,
        client,
        recoveryCode,
        storage,
      });
      if (!_recoveryCode) {
        throw new Error(ErrorMessages.missingRecoveryCode);
      }
      try {
        await setUpShareForNewDevice({
          client: client,
          recoveryCode: _recoveryCode,
          storage,
        });
      } catch (error) {
        console.error("Error setting up wallet on device", error);
        throw error;
      }
    }
  }

  return storedToken;
}

export async function postAuthUserManaged(args: {
  storedToken: AuthStoredTokenWithCookieReturnType["storedToken"];
  client: ThirdwebClient;
  password: string;
  storage: ClientScopedStorage;
}) {
  const { storedToken, client, password, storage } = args;
  const _password = await getRecoveryCode({
    storedToken,
    client,
    recoveryCode: password,
    storage,
  });

  if (storedToken.shouldStoreCookieString) {
    await storage.saveAuthCookie(storedToken.cookieString);
  }

  await setWallerUserDetails({
    clientId: client.clientId,
    userId: storedToken.authDetails.userWalletId,
    email:
      "email" in storedToken.authDetails
        ? storedToken.authDetails.email
        : "phoneNumber" in storedToken.authDetails
          ? storedToken.authDetails.phoneNumber
          : undefined,
  });

  if (storedToken.isNewUser) {
    await setUpNewUserWallet({
      client,
      recoveryCode: _password,
      storage,
    });
  } else {
    try {
      // existing device share
      await getDeviceShare(client.clientId);
    } catch {
      // trying to recreate device share from recovery code to derive wallet
      try {
        await setUpShareForNewDevice({
          client,
          recoveryCode: _password,
          storage,
        });
      } catch (error) {
        console.error("Error setting up wallet on device", error);
        throw error;
      }
    }
  }

  return storedToken;
}

async function getRecoveryCode(args: {
  storedToken: AuthStoredTokenWithCookieReturnType["storedToken"];
  client: ThirdwebClient;
  storage: ClientScopedStorage;
  recoveryCode?: string;
}): Promise<string> {
  const { storedToken, client, storage, recoveryCode } = args;
  if (storedToken.authDetails.recoveryShareManagement === "AWS_MANAGED") {
    if (
      storedToken.authProvider === "CustomJWT" ||
      storedToken.authProvider === "CustomAuthEndpoint"
    ) {
      if (!recoveryCode) {
        throw new Error(
          `GetRecoveryCode error: ${ErrorMessages.missingRecoveryCode}`,
        );
      }
      return recoveryCode;
    }
    try {
      return await getCognitoRecoveryPasswordV2({ client, storage });
    } catch {
      return await getCognitoRecoveryPasswordV1({ client, storage }).catch(
        () => {
          throw new Error("Something went wrong getting cognito recovery code");
        },
      );
    }
  } else if (
    storedToken.authDetails.recoveryShareManagement === "USER_MANAGED"
  ) {
    if (recoveryCode) {
      return recoveryCode;
    }
    throw new Error(ErrorMessages.missingRecoveryCode);
  } else {
    throw new Error("Invalid recovery share management option");
  }
}
