import {
  AuthProvider,
  AuthStoredTokenWithCookieReturnType,
  RecoveryShareManagement,
} from "@paperxyz/embedded-wallet-service-sdk";
import type { CognitoUser } from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";

import {
  generateAuthTokenFromCognitoEmailOtp,
  getEmbeddedWalletUserDetail,
  verifyClientId,
} from "./helpers/api/fetchers";
import {
  cognitoEmailSignIn,
  cognitoEmailSignUp,
} from "./helpers/auth/cognitoAuth";
import { postPaperAuth, prePaperAuth } from "./helpers/auth/middleware";
import { isDeviceSharePresentForUser } from "./helpers/storage/local";
import { getCognitoUser, setCognitoUser } from "./helpers/storage/state";
import { SendEmailOtpReturnType } from "@thirdweb-dev/wallets";

export async function sendEmailOTP(
  email: string,
  clientId: string,
): Promise<SendEmailOtpReturnType> {
  await verifyClientId(clientId);

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
        recoveryShareManagement: RecoveryShareManagement.AWS_MANAGED,
      }
    : {
        isNewUser: result.isNewUser,
        isNewDevice: !(await isDeviceSharePresentForUser(
          clientId,
          result.walletUserId ?? "",
        )),
        recoveryShareManagement: RecoveryShareManagement.AWS_MANAGED,
      };
}

// testing
export async function validateEmailOTP({
  clientId,
  otp,
}: {
  otp: string;
  clientId: string;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  let verifiedToken: Awaited<
    ReturnType<typeof generateAuthTokenFromCognitoEmailOtp>
  >["verifiedToken"];
  let verifiedTokenJwtString: string;

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

    await postPaperAuth(storedToken, clientId);

    return { storedToken };
  } catch (e) {
    throw new Error(
      `Malformed response from the verify one time password: ${JSON.stringify(
        e,
      )}`,
    );
  }
}
