import type { CognitoUser } from "amazon-cognito-identity-js";

import {
  AuthProvider,
  AuthStoredTokenWithCookieReturnType,
  SendEmailOtpReturnType,
} from "@thirdweb-dev/wallets";
import {
  generateAuthTokenFromCognitoEmailOtp,
  getEmbeddedWalletUserDetail,
  sendUserManagedEmailOtp,
  validateUserManagedEmailOtp,
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
import { getCognitoUser, setCognitoUser } from "./helpers/storage/state";
import { isDeviceSharePresentForUser } from "./helpers/storage/local";
import { Auth } from "aws-amplify";
import {
  DOMAIN_URL_2023,
  EWS_VERSION_HEADER,
  ROUTE_AUTH_ENDPOINT_CALLBACK,
  ROUTE_AUTH_JWT_CALLBACK,
  ROUTE_HEADLESS_OAUTH_LOGIN,
  THIRDWEB_SESSION_NONCE_HEADER,
} from "./helpers/constants";
import {
  AuthEndpointOptions,
  AuthOptions,
  OauthOption,
  VerifiedTokenResponse,
} from "../types";
import { InAppBrowser } from "react-native-inappbrowser-reborn";
import { createErrorMessage } from "./helpers/errors";
import {
  appBundleId,
  reactNativePackageVersion,
} from "../../../../utils/version";
import { BUNDLE_ID_HEADER } from "../../../../constants/headers";
import { ANALYTICS } from "./helpers/analytics";

export async function sendVerificationEmail(options: {
  email: string;
  clientId: string;
}): Promise<SendEmailOtpReturnType> {
  await verifyClientId(options.clientId);

  await prePaperAuth({
    authenticationMethod: AuthProvider.COGNITO,
    email: options.email,
  });

  let result: Awaited<ReturnType<typeof getEmbeddedWalletUserDetail>>;
  try {
    result = await getEmbeddedWalletUserDetail({
      email: options.email,
      clientId: options.clientId,
    });
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response from the send email OTP API", e),
    );
  }

  if (result.recoveryShareManagement === "USER_MANAGED") {
    try {
      await sendUserManagedEmailOtp(options.email, options.clientId);
    } catch (error) {
      throw new Error(`Error sending user managed email otp: ${error}`);
    }
  } else {
    // CLOUD_MANAGED
    let cognitoUser: CognitoUser;
    try {
      cognitoUser = await cognitoEmailSignIn(options.email, options.clientId);
    } catch (e) {
      await cognitoEmailSignUp(options.email, options.clientId);
      cognitoUser = await cognitoEmailSignIn(options.email, options.clientId);
    }
    setCognitoUser(cognitoUser);
  }

  return result.isNewUser
    ? {
        isNewUser: result.isNewUser,
        isNewDevice: true,
        recoveryShareManagement: result.recoveryShareManagement,
      }
    : {
        isNewUser: result.isNewUser,
        isNewDevice: !(await isDeviceSharePresentForUser(
          options.clientId,
          result.walletUserId ?? "",
        )),
        recoveryShareManagement: result.recoveryShareManagement,
      };
}

export async function validateEmailOTP(options: {
  email: string;
  otp: string;
  clientId: string;
  recoveryCode?: string;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  let result: Awaited<ReturnType<typeof getEmbeddedWalletUserDetail>>;
  try {
    result = await getEmbeddedWalletUserDetail({
      email: options.email,
      clientId: options.clientId,
    });
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response validating the OTP", e),
    );
  }
  let verifiedTokenResponse: VerifiedTokenResponse;

  if (result.recoveryShareManagement === "USER_MANAGED") {
    try {
      verifiedTokenResponse = await validateUserManagedEmailOtp({
        email: options.email,
        otp: options.otp,
        clientId: options.clientId,
      });
    } catch (error) {
      throw new Error(`Error validating user managed email otp: ${error}`);
    }
  } else {
    try {
      let cognitoUser = getCognitoUser();
      if (!cognitoUser) {
        throw new Error("MISSING COGNITO USER");
      }
      cognitoUser = await Auth.sendCustomChallengeAnswer(
        cognitoUser,
        options.otp,
      );

      // It we get here, the answer was sent successfully,
      // but it might have been wrong (1st or 2nd time)
      // So we should test if the user is authenticated now
      const session = await Auth.currentSession();

      verifiedTokenResponse = await generateAuthTokenFromCognitoEmailOtp(
        session,
        options.clientId,
      );
    } catch (e) {
      throw new Error(`Invalid OTP ${e}`);
    }
  }

  try {
    const storedToken: AuthStoredTokenWithCookieReturnType["storedToken"] = {
      jwtToken: verifiedTokenResponse.verifiedToken.jwtToken,
      authDetails: verifiedTokenResponse.verifiedToken.authDetails,
      authProvider: verifiedTokenResponse.verifiedToken.authProvider,
      developerClientId: verifiedTokenResponse.verifiedToken.developerClientId,
      cookieString: verifiedTokenResponse.verifiedTokenJwtString,
      // we should always store the jwt cookie since there's no concept of cookie in react native
      shouldStoreCookieString: true,
      isNewUser: verifiedTokenResponse.verifiedToken.isNewUser,
    };

    await postPaperAuth({
      storedToken,
      clientId: options.clientId,
      recoveryCode: options.recoveryCode,
    });

    return { storedToken };
  } catch (e) {
    throw new Error(
      createErrorMessage(
        "Malformed response from the verify one time password",
        e,
      ),
    );
  }
}

export async function socialLogin(oauthOptions: OauthOption, clientId: string) {
  const encodedProvider = encodeURIComponent(oauthOptions.provider);
  const headlessLoginLinkWithParams = `${ROUTE_HEADLESS_OAUTH_LOGIN}?authProvider=${encodedProvider}&baseUrl=${encodeURIComponent(
    DOMAIN_URL_2023,
  )}&platform=${encodeURIComponent("mobile")}`;

  const resp = await fetch(headlessLoginLinkWithParams, {
    headers: {
      [EWS_VERSION_HEADER]: reactNativePackageVersion,
      [BUNDLE_ID_HEADER]: appBundleId,
      [THIRDWEB_SESSION_NONCE_HEADER]: ANALYTICS.nonce,
    },
  });

  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(`Error getting headless sign in link: ${error.message}`);
  }

  const json = await resp.json();

  const { platformLoginLink } = json;

  const completeLoginUrl = `${platformLoginLink}?developerClientId=${encodeURIComponent(
    clientId,
  )}&platform=${encodeURIComponent("mobile")}&redirectUrl=${encodeURIComponent(
    oauthOptions.redirectUrl,
  )}&authOption=${encodedProvider}`;

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

  if (result.type === "cancel") {
    throw new Error(`Sign in cancelled`);
  }

  if (result.type !== "success") {
    throw new Error(`Can't sign in with ${oauthOptions.provider}: ${result}`);
  }

  const decodedUrl = decodeURIComponent(result.url);

  const parts = decodedUrl.split("?authResult=");
  if (parts.length < 2) {
    // assume error
    const error = decodedUrl.split("?error=")?.[1];
    throw new Error(`Something went wrong: ${error}`);
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

    await postPaperAuth({ storedToken: toStoreToken, clientId });

    return { storedToken, email: storedToken.authDetails.email };
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response from post authentication", e),
    );
  }
}

export async function customJwt(authOptions: AuthOptions, clientId: string) {
  const { jwt, password } = authOptions;

  const resp = await fetch(ROUTE_AUTH_JWT_CALLBACK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [EWS_VERSION_HEADER]: reactNativePackageVersion,
      [BUNDLE_ID_HEADER]: appBundleId,
      [THIRDWEB_SESSION_NONCE_HEADER]: ANALYTICS.nonce,
    },
    body: JSON.stringify({
      jwt: jwt,
      developerClientId: clientId,
    }),
  });
  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(`JWT authentication error: ${error.message}`);
  }

  try {
    const { verifiedToken, verifiedTokenJwtString } = await resp.json();

    const toStoreToken: AuthStoredTokenWithCookieReturnType["storedToken"] = {
      jwtToken: verifiedToken.jwtToken,
      authProvider: verifiedToken.authProvider,
      authDetails: {
        ...verifiedToken.authDetails,
        email: verifiedToken.authDetails.email,
      },
      developerClientId: verifiedToken.developerClientId,
      cookieString: verifiedTokenJwtString,
      shouldStoreCookieString: true,
      isNewUser: verifiedToken.isNewUser,
    };

    await postPaperAuthUserManaged(toStoreToken, clientId, password);

    return { verifiedToken, email: verifiedToken.authDetails.email };
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response from post authentication", e),
    );
  }
}

export async function authEndpoint(
  authOptions: AuthEndpointOptions,
  clientId: string,
) {
  const { payload, encryptionKey } = authOptions;

  const resp = await fetch(ROUTE_AUTH_ENDPOINT_CALLBACK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [EWS_VERSION_HEADER]: reactNativePackageVersion,
      [BUNDLE_ID_HEADER]: appBundleId,
    },
    body: JSON.stringify({
      payload: payload,
      developerClientId: clientId,
    }),
  });
  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(`JWT authentication error: ${error.message}`);
  }

  try {
    const { verifiedToken, verifiedTokenJwtString } = await resp.json();

    const toStoreToken: AuthStoredTokenWithCookieReturnType["storedToken"] = {
      jwtToken: verifiedToken.jwtToken,
      authProvider: verifiedToken.authProvider,
      authDetails: {
        ...verifiedToken.authDetails,
        email: verifiedToken.authDetails.email,
      },
      developerClientId: verifiedToken.developerClientId,
      cookieString: verifiedTokenJwtString,
      shouldStoreCookieString: true,
      isNewUser: verifiedToken.isNewUser,
    };

    await postPaperAuthUserManaged(toStoreToken, clientId, encryptionKey);

    return { verifiedToken, email: verifiedToken.authDetails.email };
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response from post authentication", e),
    );
  }
}
