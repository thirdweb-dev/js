import { createAuthStorage } from "../../core/authentication/index.js";
import type {
  AuthArgsType,
  AuthTokenStorageType,
  LinkAuthArgsType,
} from "../../core/authentication/type.js";

const createAuthLocalStorage = () => {
  return createAuthStorage({
    fetchToken: ({ key }) => {
      return localStorage.getItem(key) ?? undefined;
    },
    storeToken: async ({ key, value }) => {
      localStorage.setItem(key, value);
    },
    removeToken: async ({ key }) => {
      localStorage.removeItem(key);
    },
  });
};

/**
 * Fetches the authenticated user
 * @param arg - The options for fetching the authenticated user
 * @param arg.storage - The storage override options for the auth user token. Defaults to localStorage
 * @example
 * ```ts
 * import { getAuthenticatedUser } from "thirdweb/wallets/embedded-wallet/web/authentication";
 *
 * const user = await getAuthenticatedUser();
 * console.log(user);
 * ```
 * @returns A Promise that resolves to the authenticated user
 */
export const getAuthenticatedUser = async (arg?: {
  storage: AuthTokenStorageType;
}) => {
  const { getAuthenticatedUser: getAuthenticatedUserCore } = await import(
    "../../core/authentication/index.js"
  );
  if (arg) {
    return getAuthenticatedUserCore(arg);
  }
  const storage = createAuthLocalStorage();
  return getAuthenticatedUserCore({ storage });
};

/**
 * Completes the authentication process.
 * @param arg - The options for completing the authentication process
 * @example
 * ```ts
 * import { authenticate } from "thirdweb/wallets/embedded-wallet/core/authentication";
 *
 *  const user = await authenticate({
 *    provider: "google",
 *  });
 *  ```
 * @returns A Promise that resolves to the authenticated user.
 */
export const authenticate = async (
  arg: Omit<AuthArgsType, "storage" | "handleOauth"> &
    Partial<Pick<AuthArgsType, "storage">>,
) => {
  const { authenticate: authenticateCore } = await import(
    "../../core/authentication/index.js"
  );
  const { openPopUp, oauthListener } = await import("./utils.js");

  const storage = arg.storage ?? createAuthLocalStorage();

  return authenticateCore({
    ...(arg as any),
    storage,
    handleOauth: ({ url }) => {
      let popUpSize: string | undefined;
      switch (arg.provider) {
        case "discord":
          popUpSize = "width=450,height=600";
          break;
        default:
          break;
      }

      const popup = openPopUp(url, popUpSize);
      return oauthListener(storage)(popup);
    },
  });
};

/**
 * Links an existing user account with a new authentication provider.
 * @param arg - The options for linking the user account
 * @example
 * ```ts
 * import { linkAuthentication } from "thirdweb/wallets/embedded-wallet/core/authentication";
 * await linkAuthentication({
 *     provider: "google",
 *     googleOauthPrompt: "select_account",
 * });
 * ```
 * @returns A Promise that resolves to the authenticated user.
 */
export const linkAuthentication = async (
  arg: Omit<LinkAuthArgsType, "storage" | "handleOauth"> &
    Partial<Pick<LinkAuthArgsType, "storage">>,
) => {
  const { linkAuthentication: linkAuthenticationCore } = await import(
    "../../core/authentication/index.js"
  );
  const { openPopUp, oauthListener } = await import("./utils.js");

  const storage = arg.storage ?? createAuthLocalStorage();

  return linkAuthenticationCore({
    ...(arg as any),
    client: arg.client,
    storage,
    handleOauth: ({ url }) => {
      let popUpSize: string | undefined;
      switch (arg.provider) {
        case "discord":
          popUpSize = "width=450,height=600";
          break;
        default:
          break;
      }

      const popup = openPopUp(url, popUpSize);
      return oauthListener(storage)(popup);
    },
  });
};

/**
 * Logs out the authenticated user. This function will always succeed
 * @param arg - The options for logging out the authenticated user
 * @param arg.storage - The storage override options for the auth user token. Defaults to localStorage
 * @example
 * ```ts
 * import { logout } from "thirdweb/wallets/embedded-wallet/web/authentication";
 *
 * await logout();
 * ```
 * @returns A Promise that resolves to void
 */
export const logout = async (arg?: { storage: AuthTokenStorageType }) => {
  const { logout: logoutCore } = await import(
    "../../core/authentication/index.js"
  );
  const storage = arg?.storage ?? createAuthLocalStorage();
  return logoutCore({ storage });
};

export {
  confirm2FA,
  pre2FA,
  preLinkAuthentication,
} from "../../core/authentication/index.js";
