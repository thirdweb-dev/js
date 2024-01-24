import { createAuthStorage } from "../core/authentication.js";
import type {
  AuthArgsType,
  AuthTokenStorageType,
  AuthUserType,
} from "../core/authentication.type.js";

const createAuthLocalStorage = () => {
  return createAuthStorage({
    fetchToken: ({ key }) => {
      return localStorage.getItem(key) ?? undefined;
    },
    storeToken: async ({ key, value }) => {
      localStorage.setItem(key, value);
    },
  });
};

export const getAuthenticatedUser = async (arg?: {
  storage: AuthTokenStorageType;
}) => {
  const { getAuthenticatedUser: getAuthenticatedUserCore } = await import(
    "../core/authentication.js"
  );
  if (arg) {
    return getAuthenticatedUserCore(arg);
  }
  const storage = createAuthLocalStorage();
  return getAuthenticatedUserCore({ storage });
};

export const authenticate = async (
  arg: Omit<AuthArgsType, "storage" | "handleOauth"> &
    Partial<Pick<AuthArgsType, "storage">>,
) => {
  const { authenticate: authenticateCore } = await import(
    "../core/authentication.js"
  );
  const { getBaseUrl } = await import("../core/base-url.js");
  const { openPopUp } = await import("./authentication.utils.js");
  const {
    AuthenticationError,
    USER_ABORT_AUTHENTICATION_ERROR_MESSAGE,
    UserAbortError,
  } = await import("../core/authentication.error.js");
  const { THIRDWEB_AUTH_TOKEN_KEY } = await import(
    "../core/authentication.constant.js"
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

export {
  confirm2FA,
  linkAuthentication,
  pre2FA,
  preLinkAuthentication,
} from "../core/authentication.js";
