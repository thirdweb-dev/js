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
    console.log("========== New User ==========");
    console.log("recoveryCode before get", recoveryCode);
    const _recoveryCode = await getRecoveryCode(
      storedToken,
      clientId,
      recoveryCode,
    );
    console.log("recoveryCode", _recoveryCode);
    if (!_recoveryCode) {
      throw new Error(ErrorMessages.missingRecoveryCode);
    }
    console.log("call setup new user wallet");
    await setUpNewUserWallet(_recoveryCode, clientId);
    console.log("finished setup new user wallet");
  } else {
    try {
      // existing device share
      await getDeviceShare(clientId);
      console.log("========== Existing user with device share ==========");
    } catch (e) {
      console.log("recoveryCode before get for existing", recoveryCode);
      const _recoveryCode = await getRecoveryCode(
        storedToken,
        clientId,
        recoveryCode,
      );
      console.log("recoveryCode", _recoveryCode);
      if (!_recoveryCode) {
        throw new Error(ErrorMessages.missingRecoveryCode);
      }
      console.log("========== Existing user on new device ==========");

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
  if (storedToken.shouldStoreCookieString) {
    await setAuthTokenClient(storedToken.cookieString, clientId);
  }

  await setWallerUserDetails({
    clientId,
    userId: storedToken.authDetails.userWalletId,
    email: storedToken.authDetails.email,
  });

  if (storedToken.isNewUser) {
    console.log("========== New User ==========");
    await setUpNewUserWallet(password, clientId);
  } else {
    try {
      // existing device share
      await getDeviceShare(clientId);
      console.log("========== Existing user with device share ==========");
    } catch (e) {
      // trying to recreate device share from recovery code to derive wallet
      console.log("========== Existing user on new device ==========");

      try {
        await setUpShareForNewDevice({
          clientId,
          recoveryCode: password,
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
      // derive sub here
      const code = extractSubFromJwt(storedToken.jwtToken);
      if (!code) {
        throw new Error(ErrorMessages.missingRecoveryCode);
      }
      return code;
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

function extractSubFromJwt(jwtToken: string): string | undefined {
  const parts = jwtToken.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT format.");
  }

  const encodedPayload = parts[1];
  if (!encodedPayload) {
    throw new Error("Invalid JWT format.");
  }
  const decodedPayload = Buffer.from(encodedPayload, "base64").toString("utf8");

  try {
    const payloadObject = JSON.parse(decodedPayload);
    if (payloadObject && payloadObject.sub) {
      return payloadObject.sub;
    }
  } catch (error) {
    throw new Error("Error parsing JWT payload as JSON.");
  }
}
