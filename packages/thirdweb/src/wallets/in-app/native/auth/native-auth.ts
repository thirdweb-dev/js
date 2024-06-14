import type { CognitoUser } from "amazon-cognito-identity-js";

import { Auth } from "aws-amplify";
import * as WebBrowser from "expo-web-browser";
import type { ThirdwebClient } from "../../../../client/client.js";
import {
  AuthProvider,
  type AuthStoredTokenWithCookieReturnType,
  type OauthOption,
  RecoveryShareManagement,
  type SendEmailOtpReturnType,
} from "../../core/authentication/type.js";
import {
  deleteAccount,
  fetchUserDetails,
  generateAuthTokenFromCognitoEmailOtp,
  getSessionHeaders,
  verifyClientId,
} from "../helpers/api/fetchers.js";
import {
  cognitoEmailSignIn,
  cognitoEmailSignUp,
  cognitoPhoneSignIn,
  cognitoPhoneSignUp,
} from "../helpers/auth/cognitoAuth.js";
import {
  postAuth,
  postAuthUserManaged,
  preAuth,
} from "../helpers/auth/middleware.js";
import {
  DOMAIN_URL_2023,
  ROUTE_AUTH_ENDPOINT_CALLBACK,
  ROUTE_AUTH_JWT_CALLBACK,
  ROUTE_HEADLESS_OAUTH_LOGIN,
} from "../helpers/constants.js";
import { createErrorMessage } from "../helpers/errors.js";
import { isDeviceSharePresentForUser } from "../helpers/storage/local.js";
import { getCognitoUser, setCognitoUser } from "../helpers/storage/state.js";
import type { VerifiedTokenResponse } from "../helpers/types.js";

export async function sendVerificationEmail(options: {
  email: string;
  client: ThirdwebClient;
}): Promise<SendEmailOtpReturnType> {
  await verifyClientId(options.client);

  await preAuth({
    authenticationMethod: AuthProvider.COGNITO,
    email: options.email,
  });

  let result: Awaited<ReturnType<typeof fetchUserDetails>>;
  try {
    result = await fetchUserDetails({
      email: options.email,
      client: options.client,
    });
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response from the send email OTP API", e),
    );
  }

  let cognitoUser: CognitoUser;
  try {
    cognitoUser = await cognitoEmailSignIn(
      options.email,
      options.client.clientId,
    );
  } catch (e) {
    await cognitoEmailSignUp(options.email, options.client.clientId);
    cognitoUser = await cognitoEmailSignIn(
      options.email,
      options.client.clientId,
    );
  }
  setCognitoUser(cognitoUser);

  return {
    isNewUser: false, // TODO (rn) check this assumption is ok
    isNewDevice: !(await isDeviceSharePresentForUser(
      options.client.clientId,
      result.walletUserId ?? "",
    )),
    recoveryShareManagement: RecoveryShareManagement.CLOUD_MANAGED,
  };
}

export async function sendVerificationSms(options: {
  phoneNumber: string;
  client: ThirdwebClient;
}): Promise<SendEmailOtpReturnType> {
  await verifyClientId(options.client);

  await preAuth({
    authenticationMethod: AuthProvider.COGNITO,
    phone: options.phoneNumber,
  });

  let result: Awaited<ReturnType<typeof fetchUserDetails>>;
  try {
    result = await fetchUserDetails({
      email: options.phoneNumber, // TODO should cleanup the API here
      client: options.client,
    });
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response from the send email OTP API", e),
    );
  }

  let cognitoUser: CognitoUser;
  try {
    cognitoUser = await cognitoPhoneSignIn(
      options.phoneNumber,
      options.client.clientId,
    );
  } catch (e) {
    await cognitoPhoneSignUp(options.phoneNumber, options.client.clientId);
    cognitoUser = await cognitoPhoneSignIn(
      options.phoneNumber,
      options.client.clientId,
    );
  }
  setCognitoUser(cognitoUser);

  return {
    isNewUser: false, // TODO (rn) check this assumption is ok
    isNewDevice: !(await isDeviceSharePresentForUser(
      options.client.clientId,
      result.walletUserId ?? "",
    )),
    recoveryShareManagement: RecoveryShareManagement.CLOUD_MANAGED,
  };
}

export async function validateEmailOTP(options: {
  email: string;
  otp: string;
  client: ThirdwebClient;
  recoveryCode?: string;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  try {
    await fetchUserDetails({
      email: options.email,
      client: options.client,
    });
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response validating the OTP", e),
    );
  }
  let verifiedTokenResponse: VerifiedTokenResponse;

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
      options.client.clientId,
    );
  } catch (e) {
    throw new Error(`Invalid OTP ${e}`);
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

    await postAuth({
      storedToken,
      client: options.client,
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

export async function socialLogin(
  oauthOptions: OauthOption,
  client: ThirdwebClient,
): Promise<AuthStoredTokenWithCookieReturnType> {
  const encodedProvider = encodeURIComponent(oauthOptions.provider);
  const headlessLoginLinkWithParams = `${ROUTE_HEADLESS_OAUTH_LOGIN}?authProvider=${encodedProvider}&baseUrl=${encodeURIComponent(
    DOMAIN_URL_2023,
  )}&platform=${encodeURIComponent("mobile")}`;

  const resp = await fetch(headlessLoginLinkWithParams, {
    headers: {
      ...getSessionHeaders(),
    },
  });

  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(`Error getting headless sign in link: ${error.message}`);
  }

  const json = await resp.json();

  const { platformLoginLink } = json;

  const completeLoginUrl = `${platformLoginLink}?developerClientId=${encodeURIComponent(
    client.clientId,
  )}&platform=${encodeURIComponent("mobile")}&redirectUrl=${encodeURIComponent(
    oauthOptions.redirectUrl,
  )}&authOption=${encodedProvider}`;

  // TODO platform specific code should be extracted out
  const result = await WebBrowser.openAuthSessionAsync(
    completeLoginUrl,
    oauthOptions.redirectUrl,
    {
      preferEphemeralSession: false,
      showTitle: false,
      enableDefaultShareMenuItem: false,
      enableBarCollapsing: false,
    },
  );

  if (result.type === "cancel") {
    throw new Error("Sign in cancelled");
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
  if (!authResult) {
    throw new Error("No auth result found");
  }
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

    await postAuth({ storedToken: toStoreToken, client });

    return { storedToken };
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response from post authentication", e),
    );
  }
}

export async function customJwt(
  authOptions: { jwt: string; password: string },
  client: ThirdwebClient,
): Promise<AuthStoredTokenWithCookieReturnType> {
  const { jwt, password } = authOptions;

  const resp = await fetch(ROUTE_AUTH_JWT_CALLBACK, {
    method: "POST",
    headers: {
      ...getSessionHeaders(),
    },
    body: JSON.stringify({
      jwt: jwt,
      developerClientId: client.clientId,
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

    await postAuthUserManaged(toStoreToken, client, password);

    return { storedToken: verifiedToken };
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response from post jwt authentication", e),
    );
  }
}

export async function authEndpoint(
  authOptions: { payload: string; encryptionKey: string },
  client: ThirdwebClient,
): Promise<AuthStoredTokenWithCookieReturnType> {
  const { payload, encryptionKey } = authOptions;

  const resp = await fetch(ROUTE_AUTH_ENDPOINT_CALLBACK, {
    method: "POST",
    headers: {
      ...getSessionHeaders(),
    },
    body: JSON.stringify({
      payload: payload,
      developerClientId: client.clientId,
    }),
  });
  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(
      `Custom auth endpoint authentication error: ${error.message}`,
    );
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

    await postAuthUserManaged(toStoreToken, client, encryptionKey);

    return { storedToken: verifiedToken };
  } catch (e) {
    throw new Error(
      createErrorMessage(
        "Malformed response from post auth_endpoint authentication",
        e,
      ),
    );
  }
}

export async function deleteActiveAccount(options: {
  client: ThirdwebClient;
}): Promise<boolean> {
  await verifyClientId(options.client);

  try {
    return deleteAccount(options.client);
  } catch (e) {
    throw new Error(createErrorMessage("Error deleting the active account", e));
  }
}
