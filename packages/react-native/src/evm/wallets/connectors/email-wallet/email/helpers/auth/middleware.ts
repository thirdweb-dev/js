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

  // console.log('setWalletUserDetails', !!storedToken.cookieString);

  await setWallerUserDetails({
    clientId,
    userId: storedToken.authDetails.userWalletId,
    email: storedToken.authDetails.email,
  });

  // console.log('setWalletUserDetails done');

  if (storedToken.isNewUser) {
    // console.log('isNewUser');
    const recoveryCode = await getCognitoRecoveryPassword(clientId);
    await setUpNewUserWallet(recoveryCode, clientId);
  } else {
    try {
      // console.log('not new user', clientId);
      // existing device share
      await getDeviceShare(clientId);
    } catch (e) {
      // trying to recreate device share from recovery code to derive wallet
      console.warn(
        "Did not manage to automatically recreate wallet for previously logged in user, using recovery code. ",
        e,
      );
      const recoveryCode = await getCognitoRecoveryPassword(clientId);
      // console.log('recoveryCode', recoveryCode);

      try {
        await setUpShareForNewDevice({
          clientId,
          recoveryCode,
        });
      } catch (error) {
        console.error("Error settign up wallet on device", error);
        throw error;
      }
    }
  }

  return storedToken;
}
