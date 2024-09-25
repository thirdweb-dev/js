import * as WebBrowser from "expo-web-browser";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { nativeLocalStorage } from "../../../../utils/storage/nativeStorage.js";
import type { Wallet } from "../../../interfaces/wallet.js";
import type { ClientScopedStorage } from "../../core/authentication/client-scoped-storage.js";
import { getLoginUrl } from "../../core/authentication/getLoginPath.js";
import { guestAuthenticate } from "../../core/authentication/guest.js";
import { siweAuthenticate } from "../../core/authentication/siwe.js";
import type {
  AuthStoredTokenWithCookieReturnType,
  MultiStepAuthArgsType,
  OAuthRedirectObject,
} from "../../core/authentication/types.js";
import type { Ecosystem } from "../../core/wallet/types.js";
import { verifyOtp } from "../../web/lib/auth/otp.js";
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
    storage: ClientScopedStorage;
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

    await postAuth({
      storedToken: toStoreToken,
      client: options.client,
      storage: options.storage,
    });

    return { storedToken };
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response from post authentication", e),
    );
  }
}

export async function authenticate(args: {
  auth: OAuthRedirectObject;
  client: ThirdwebClient;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  const { auth, client } = args;
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

export async function socialLogin(args: {
  auth: OAuthRedirectObject;
  client: ThirdwebClient;
  storage: ClientScopedStorage;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  const { auth, client, storage } = args;
  const { storedToken } = await authenticate({ auth, client });
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

    await postAuth({ storedToken: toStoreToken, client, storage });

    return { storedToken };
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response from post authentication", e),
    );
  }
}

export async function siweLogin(args: {
  client: ThirdwebClient;
  wallet: Wallet;
  chain: Chain;
  ecosystem?: Ecosystem;
  storage: ClientScopedStorage;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  const { client, ecosystem, wallet, chain, storage } = args;
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

    await postAuth({ storedToken: toStoreToken, client, storage });

    return { storedToken };
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response from post authentication", e),
    );
  }
}

export async function guestLogin(args: {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  storage: ClientScopedStorage;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  const { client, ecosystem, storage } = args;
  const { storedToken } = await guestAuthenticate({
    client,
    ecosystem,
    storage: nativeLocalStorage,
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

    await postAuth({ storedToken: toStoreToken, client, storage });

    return { storedToken };
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response from post authentication", e),
    );
  }
}

export async function customJwt(args: {
  authOptions: { jwt: string; password: string };
  client: ThirdwebClient;
  storage: ClientScopedStorage;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  const { jwt, password } = args.authOptions;

  const resp = await fetch(ROUTE_AUTH_JWT_CALLBACK, {
    method: "POST",
    headers: {
      ...getSessionHeaders(),
    },
    body: JSON.stringify({
      jwt: jwt,
      developerClientId: args.client.clientId,
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

    await postAuthUserManaged({
      storedToken: toStoreToken,
      client: args.client,
      password,
      storage: args.storage,
    });

    return { storedToken: verifiedToken };
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response from post jwt authentication", e),
    );
  }
}

export async function authEndpoint(args: {
  authOptions: { payload: string; encryptionKey: string };
  client: ThirdwebClient;
  storage: ClientScopedStorage;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  const { payload, encryptionKey } = args.authOptions;

  const resp = await fetch(ROUTE_AUTH_ENDPOINT_CALLBACK, {
    method: "POST",
    headers: {
      ...getSessionHeaders(),
    },
    body: JSON.stringify({
      payload: payload,
      developerClientId: args.client.clientId,
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

    await postAuthUserManaged({
      storedToken: toStoreToken,
      client: args.client,
      password: encryptionKey,
      storage: args.storage,
    });

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
  storage: ClientScopedStorage;
}): Promise<boolean> {
  await verifyClientId(options.client);

  try {
    return deleteAccount({
      client: options.client,
      storage: options.storage,
    });
  } catch (e) {
    throw new Error(createErrorMessage("Error deleting the active account", e));
  }
}
