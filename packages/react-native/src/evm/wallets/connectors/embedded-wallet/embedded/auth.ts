import {
  AuthProvider,
  AuthStoredTokenWithCookieReturnType,
} from "@paperxyz/embedded-wallet-service-sdk";
import type { CognitoUser } from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";

import {
  RecoveryShareManagement,
  SendEmailOtpReturnType,
} from "@thirdweb-dev/wallets";
import { InAppBrowser } from "react-native-inappbrowser-reborn";
import {
  generateAuthTokenFromCognitoEmailOtp,
  getEmbeddedWalletUserDetail,
  verifyClientId,
} from "./helpers/api/fetchers";
import {
  cognitoEmailSignIn,
  cognitoEmailSignUp,
} from "./helpers/auth/cognitoAuth";
import {
  postPaperAuth,
  postPaperAuthUserManaged,
  prePaperAuth,
} from "./helpers/auth/middleware";
import { isDeviceSharePresentForUser } from "./helpers/storage/local";
import { getCognitoUser, setCognitoUser } from "./helpers/storage/state";
import { AuthOptions, OauthOption } from "../types";
import {
  ROUTE_AUTH_JWT_CALLBACK,
  ROUTE_HEADLESS_GOOGLE_LOGIN,
} from "./helpers/constants";

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
        recoveryShareManagement: RecoveryShareManagement.CLOUD_MANAGED,
      }
    : {
        isNewUser: result.isNewUser,
        isNewDevice: !(await isDeviceSharePresentForUser(
          clientId,
          result.walletUserId ?? "",
        )),
        recoveryShareManagement: RecoveryShareManagement.CLOUD_MANAGED,
      };
}

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

export async function socialLogin(oauthOptions: OauthOption, clientId: string) {
  const headlessLoginLinkWithParams = `${ROUTE_HEADLESS_GOOGLE_LOGIN}?authProvider=${encodeURIComponent(
    "google",
  )}&baseUrl=${encodeURIComponent(
    "https://ews.thirdweb.com",
  )}&platform=${encodeURIComponent("mobile")}`;

  const resp = await fetch(headlessLoginLinkWithParams);

  if (!resp.ok) {
    throw new Error("Error getting headless login link");
  }

  const json = await resp.json();

  const { platformLoginLink } = json;

  const completeLoginUrl = `${platformLoginLink}?developerClientId=${encodeURIComponent(
    clientId || "",
  )}&platform=${encodeURIComponent("mobile")}&redirectUrl=${encodeURIComponent(
    oauthOptions.redirectUrl,
  )}`;

  const result = await InAppBrowser.openAuth(
    completeLoginUrl,
    oauthOptions.redirectUrl,
    {
      // iOS Properties
      ephemeralWebSession: false,
      // Android Properties
      showTitle: false,
      enableUrlBarHiding: false,
      enableDefaultShare: false,
    },
  );

  if (result.type !== "success") {
    throw new Error("Error signing in. Please try again later.");
  }

  const decodedUrl = decodeURIComponent(result.url);

  const parts = decodedUrl.split("?authResult=");
  if (parts.length < 2) {
    throw new Error("Malformed response from the login redirect");
  }
  const authResult = parts[1];
  const { storedToken } = JSON.parse(authResult);

  try {
    const toStoreToken: AuthStoredTokenWithCookieReturnType["storedToken"] = {
      jwtToken: storedToken.jwtToken,
      authDetails: storedToken.authDetails,
      authProvider: storedToken.authProvider,
      developerClientId: storedToken.developerClientId,
      cookieString: storedToken.cookieString,
      // we should always store the jwt cookie since there's no concept of cookie in react native
      shouldStoreCookieString: true,
      isNewUser: storedToken.isNewUser,
    };

    await postPaperAuth(toStoreToken, clientId);

    return { storedToken, email: storedToken.authDetails.email };
  } catch (e) {
    throw new Error(
      `Malformed response from post authentication: ${JSON.stringify(e)}`,
    );
  }
}

export async function customJwt(authOptions: AuthOptions, clientId: string) {
  const { jwtToken, encryptionKey } = authOptions;

  const resp = await fetch(ROUTE_AUTH_JWT_CALLBACK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jwtToken,
      authProvider: AuthProvider.CUSTOM_JWT,
      developerClientId: clientId,
    }),
  });
  if (!resp.ok) {
    const { error } = await resp.json();
    throw new Error(`JWT authentication error: ${error} `);
  }

  try {
    const { verifiedToken, verifiedTokenJwtString } = await resp.json();

    const toStoreToken: AuthStoredTokenWithCookieReturnType["storedToken"] = {
      jwtToken: verifiedToken.rawToken,
      authProvider: verifiedToken.authProvider,
      authDetails: {
        ...verifiedToken.authDetails,
        email: verifiedToken.authDetails.email,
      },
      developerClientId: verifiedToken.developerClientId,
      cookieString: verifiedTokenJwtString,
      shouldStoreCookieString: false,
      isNewUser: verifiedToken.isNewUser,
    };

    await postPaperAuthUserManaged(toStoreToken, clientId, encryptionKey);

    return { verifiedToken, email: verifiedToken.authDetails.email };
  } catch (e) {
    throw new Error(
      `Malformed response from post authentication: ${JSON.stringify(e)}`,
    );
  }
}
