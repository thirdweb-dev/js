import type {
  AuthTokenStorageType,
  AuthUserType,
} from "../../core/authentication/type.js";

/**
 * @internal
 */
export const openPopUp = (
  url: string,
  features: string = "width=350,height=500",
) => {
  return window.open(url, "popup", features);
};

/**
 * @internal
 */
export const oauthListener =
  (storage: AuthTokenStorageType) => (popup: Window | null) =>
    new Promise<AuthUserType>(async (res, rej) => {
      const { getBaseUrl } = await import("../../core/base-url.js");
      const {
        AuthenticationError,
        USER_ABORT_AUTHENTICATION_ERROR_MESSAGE,
        UserAbortError,
      } = await import("../../core/authentication/error.js");
      const { THIRDWEB_AUTH_TOKEN_KEY } = await import(
        "../../core/authentication/constant.js"
      );

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
