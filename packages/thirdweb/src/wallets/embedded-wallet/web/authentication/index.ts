import { createAuthStorage } from "../../core/authentication/index.js";
import type {
  AuthArgsType,
  AuthTokenStorageType,
  AuthUserType,
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
  const { getBaseUrl } = await import("../../core/base-url.js");
  const { openPopUp } = await import("./utils.js");
  const {
    AuthenticationError,
    USER_ABORT_AUTHENTICATION_ERROR_MESSAGE,
    UserAbortError,
  } = await import("../../core/authentication/error.js");
  const { THIRDWEB_AUTH_TOKEN_KEY } = await import(
    "../../core/authentication/constant.js"
  );

  const storage = arg.storage ?? createAuthLocalStorage();

  const oauthListener = (popup: Window | null) =>
    new Promise<AuthUserType>((res, rej) => {
      const interval = setInterval(() => {
        if (popup?.closed) {
          clearInterval(interval);
          rej(new UserAbortError());
        }
      }, 1000); // 1 second

      const authSuccessListener = async (event: MessageEvent) => {
        if (event.origin !== getBaseUrl()) {
          return;
        }
        if (event.data.eventType === "oauthSuccessResult") {
          window.removeEventListener("message", authSuccessListener);
          const authResult = event.data.authResult as AuthUserType;
          await storage.storeToken({
            key: THIRDWEB_AUTH_TOKEN_KEY,
            value: authResult.authToken,
          });
          popup?.close();
          res(authResult);
        } else if (event.data.eventType === "oauthFailureResult") {
          window.removeEventListener("message", authSuccessListener);
          popup?.close();
          const errorString = event.data.errorString as string;
          if (errorString === USER_ABORT_AUTHENTICATION_ERROR_MESSAGE) {
            return rej(new UserAbortError());
          }
          rej(new AuthenticationError(errorString));
        }
      };
      window.addEventListener("message", authSuccessListener);
    });

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
      return oauthListener(popup);
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
  linkAuthentication,
  pre2FA,
  preLinkAuthentication,
} from "../../core/authentication/index.js";
