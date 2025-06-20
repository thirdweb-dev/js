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
  encryptionKey,
  storage,
}: {
  storedToken: AuthStoredTokenWithCookieReturnType["storedToken"];
  client: ThirdwebClient;
  encryptionKey?: string;
  storage: ClientScopedStorage;
}) {
  if (storedToken.shouldStoreCookieString) {
    await storage.saveAuthCookie(storedToken.cookieString);
  }

  await setWallerUserDetails({
    clientId: client.clientId,
    email:
      "email" in storedToken.authDetails
        ? storedToken.authDetails.email
        : "phoneNumber" in storedToken.authDetails
          ? storedToken.authDetails.phoneNumber
          : undefined,
    userId: storedToken.authDetails.userWalletId,
  });

  if (storedToken.isNewUser) {
    const _recoveryCode = await getRecoveryCode({
      client,
      recoveryCode: encryptionKey,
      storage,
      storedToken,
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
        client,
        recoveryCode: encryptionKey,
        storage,
        storedToken,
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
    } catch (err) {
      console.error("Error recovering wallet", err);
      return await getCognitoRecoveryPasswordV1({ client, storage }).catch(
        () => {
          throw new Error("Something went wrong while recovering wallet");
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
