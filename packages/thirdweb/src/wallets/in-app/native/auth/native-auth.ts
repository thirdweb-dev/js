import * as WebBrowser from "expo-web-browser";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { ClientScopedStorage } from "../../core/authentication/client-scoped-storage.js";
import { getLoginUrl } from "../../core/authentication/getLoginPath.js";
import type {
  AuthStoredTokenWithCookieReturnType,
  OAuthRedirectObject,
} from "../../core/authentication/types.js";
import type { Ecosystem } from "../../core/wallet/types.js";
import { deleteAccount, verifyClientId } from "../helpers/api/fetchers.js";
import { createErrorMessage } from "../helpers/errors.js";

export async function socialAuth(args: {
  auth: OAuthRedirectObject;
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  const { auth, client, ecosystem } = args;
  const loginUrl = getLoginUrl({
    authOption: auth.strategy,
    client,
    ecosystem,
    mode: "window",
    redirectUrl: auth.redirectUrl,
  });

  const result = await WebBrowser.openAuthSessionAsync(
    loginUrl,
    auth.redirectUrl,
    {
      enableBarCollapsing: false,
      enableDefaultShareMenuItem: false,
      preferEphemeralSession: false,
      showTitle: false,
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
