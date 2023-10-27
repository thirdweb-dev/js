import {
  AuthProvider,
  AuthStoredTokenWithCookieReturnType,
} from "@paperxyz/embedded-wallet-service-sdk";
import {
  getDeviceShare,
  setAuthTokenClient,
  setWallerUserDetails,
} from "../storage/local";
import { setUpNewUserWallet } from "../wallet/creation";
import { getCognitoRecoveryPassword } from "../wallet/recoveryCode";
import { setUpShareForNewDevice } from "../wallet/retrieval";

export async function prePaperAuth(args: {
  authenticationMethod: AuthProvider;
  email: string;
}) {
  // TODO: Add tracking here
  Promise.resolve(args);
}

export async function postPaperAuth(
  storedToken: AuthStoredTokenWithCookieReturnType["storedToken"],
  clientId: string,
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
    const recoveryCode = await getCognitoRecoveryPassword(clientId);
    await setUpNewUserWallet(recoveryCode, clientId);
  } else {
    try {
      // existing device share
      await getDeviceShare(clientId);
      console.log("========== Existing user with device share ==========");
    } catch (e) {
      // trying to recreate device share from recovery code to derive wallet
      const recoveryCode = await getCognitoRecoveryPassword(clientId);
      console.log("========== Existing user on new device ==========");

      try {
        await setUpShareForNewDevice({
          clientId,
          recoveryCode,
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
