import * as WebBrowser from "expo-web-browser";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../interfaces/wallet.js";
import { getLoginUrl } from "../../core/authentication/getLoginPath.js";
import { siweAuthenticate } from "../../core/authentication/siwe.js";
import type {
  AuthStoredTokenWithCookieReturnType,
  MultiStepAuthArgsType,
  OauthOption,
} from "../../core/authentication/types.js";
import { verifyOtp } from "../../web/lib/auth/otp.js";
import type { Ecosystem } from "../../web/types.js";
import {
  deleteAccount,
  getSessionHeaders,
  verifyClientId,
} from "../helpers/api/fetchers.js";
import { postAuth, postAuthUserManaged } from "../helpers/auth/middleware.js";
import {
  ROUTE_AUTH_ENDPOINT_CALLBACK,
  ROUTE_AUTH_JWT_CALLBACK,
} from "../helpers/constants.js";
import { createErrorMessage } from "../helpers/errors.js";

export async function otpLogin(
  options: MultiStepAuthArgsType & {
    client: ThirdwebClient;
    ecosystem?: Ecosystem;
  },
): Promise<AuthStoredTokenWithCookieReturnType> {
  const { storedToken } = await verifyOtp(options);
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

    await postAuth({ storedToken: toStoreToken, client: options.client });

    return { storedToken };
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response from post authentication", e),
    );
  }
}

export async function authenticate(
  auth: OauthOption,
  client: ThirdwebClient,
): Promise<AuthStoredTokenWithCookieReturnType> {
  const loginUrl = getLoginUrl({
    authOption: auth.strategy,
    client,
    mode: "window",
    redirectUrl: auth.redirectUrl,
  });

  const result = await WebBrowser.openAuthSessionAsync(
    loginUrl,
    auth.redirectUrl,
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
    throw new Error(`Can't sign in with ${auth.strategy}: ${result}`);
  }

  const resultURL = new URL(result.url);
  const authResult = resultURL.searchParams.get("authResult");
  const error = resultURL.searchParams.get("error");

  // assume error
  if (error) {
    throw new Error(`Something went wrong: ${error}`);
  }

  if (!authResult) {
    throw new Error("No auth result found");
  }
  return JSON.parse(authResult);
}

export async function socialLogin(
  auth: OauthOption,
  client: ThirdwebClient,
): Promise<AuthStoredTokenWithCookieReturnType> {
  const { storedToken } = await authenticate(auth, client);
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

export async function siweLogin(
  client: ThirdwebClient,
  wallet: Wallet,
  chain: Chain,
  ecosystem?: Ecosystem,
): Promise<AuthStoredTokenWithCookieReturnType> {
  const { storedToken } = await siweAuthenticate({
    client,
    ecosystem,
    wallet,
    chain,
  });
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
