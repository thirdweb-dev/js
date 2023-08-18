import {
  AuthProvider,
  AuthStoredTokenWithCookieReturnType,
  SendEmailOtpReturnType,
} from "@paperxyz/embedded-wallet-service-sdk";
import type { CognitoUser } from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";

import {
  generateAuthTokenFromCognitoEmailOtp,
  getEmbeddedWalletUserDetail,
} from "./helpers/api/fetchers";
import {
  cognitoEmailSignIn,
  cognitoEmailSignUp,
} from "./helpers/auth/cognitoAuth";
import { prePaperAuth } from "./helpers/auth/middleware";
import {
  isDeviceSharePresentForUser,
  setAuthShareClient,
} from "./helpers/storage/local";
import { getCognitoUser, setCognitoUser } from "./helpers/storage/state";

export async function sendEmailOTP(
  email: string,
  clientId: string,
): Promise<SendEmailOtpReturnType> {
  await prePaperAuth({
    authenticationMethod: AuthProvider.COGNITO,
    email,
  });

  // AWS Auth flow
  let cognitoUser: CognitoUser;
  try {
    cognitoUser = await cognitoEmailSignIn(email, clientId);
  } catch (e) {
    await cognitoEmailSignUp(email, clientId);
    cognitoUser = await cognitoEmailSignIn(email, clientId);
  }
  setCognitoUser(cognitoUser);

  let result: Awaited<ReturnType<typeof getEmbeddedWalletUserDetail>>;
  try {
    result = await getEmbeddedWalletUserDetail({
      email,
      clientId,
    });
  } catch (e) {
    throw new Error(
      `Malformed response from the send email OTP API: ${JSON.stringify(e)}`,
    );
  }

  return result.isNewUser
    ? {
        isNewUser: result.isNewUser,
        isNewDevice: true,
      }
    : {
        isNewUser: result.isNewUser,
        isNewDevice: !(await isDeviceSharePresentForUser(
          clientId,
          result.walletUserId ?? "",
        )),
      };
}

export async function validateEmailOTP({
  clientId,
  otp,
  email,
}: {
  email: string;
  otp: string;
  clientId: string;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  let verifiedToken: Awaited<
    ReturnType<typeof generateAuthTokenFromCognitoEmailOtp>
  >["verifiedToken"];
  let verifiedTokenJwtString: string;

  console.log(`Validating email OTP for ${email}`);

  try {
    let cognitoUser = getCognitoUser();
    if (!cognitoUser) {
      throw new Error("MISSING COGNITO USER");
    }
    cognitoUser = await Auth.sendCustomChallengeAnswer(cognitoUser, otp);

    // It we get here, the answer was sent successfully,
    // but it might have been wrong (1st or 2nd time)
    // So we should test if the user is authenticated now
    const session = await Auth.currentSession();

    ({ verifiedToken, verifiedTokenJwtString } =
      await generateAuthTokenFromCognitoEmailOtp(session, clientId));
  } catch (e) {
    console.log("Apparently the user did not enter the right code", e);
    throw new Error(`Invalid OTP ${e}`);
  }

  try {
    const storedToken: AuthStoredTokenWithCookieReturnType["storedToken"] = {
      jwtToken: verifiedToken.rawToken,
      authDetails: verifiedToken.authDetails,
      authProvider: verifiedToken.authProvider,
      developerClientId: verifiedToken.developerClientId,
      cookieString: verifiedTokenJwtString,
      // we should always store the jwt cookie since there's no concept of cookie in react native
      shouldStoreCookieString: true,
      isNewUser: verifiedToken.isNewUser,
    };

    await setAuthShareClient(verifiedTokenJwtString, clientId);
    // TODO: Handle wallet instantiation

    return { storedToken };
  } catch (e) {
    throw new Error(
      `Malformed response from the verify one time password: ${JSON.stringify(
        e,
      )}`,
    );
  }
}
