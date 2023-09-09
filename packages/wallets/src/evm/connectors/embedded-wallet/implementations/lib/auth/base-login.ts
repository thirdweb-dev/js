import {
  EMBEDDED_WALLET_PATH,
  GET_IFRAME_BASE_URL,
  HEADLESS_GOOGLE_OAUTH_ROUTE,
} from "../../constants/settings";
import type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
} from "../../interfaces/auth";
import { AbstractLogin } from "./abstract-login";

export class BaseLogin extends AbstractLogin<
  {
    getRecoveryCode: (userWalletId: string) => Promise<string | undefined>;
  },
  { email: string },
  { email: string; otp: string }
> {
  override async loginWithModal(): Promise<AuthLoginReturnType> {
    await this.preLogin();
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "loginWithThirdwebModal",
      params: undefined,
      showIframe: true,
    });
    return this.postLogin(result);
  }
  override async loginWithEmailOtp({
    email,
  }: {
    email: string;
  }): Promise<AuthLoginReturnType> {
    await this.preLogin();
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "loginWithThirdwebModal",
      params: { email },
      showIframe: true,
    });
    return this.postLogin(result);
  }

  override async loginWithGoogle(): Promise<AuthLoginReturnType> {
    await this.preLogin();
    const googleOauthUrl = `${GET_IFRAME_BASE_URL()}${EMBEDDED_WALLET_PATH}${HEADLESS_GOOGLE_OAUTH_ROUTE}?developerClientId=${
      this.clientId
    }`;
    const win = window.open(googleOauthUrl, "Login", "width=350, height=500");

    // listen to result from the login window
    const result = await new Promise<AuthAndWalletRpcReturnType>(
      (resolve, reject) => {
        // detect when the user closes the login window
        const pollTimer = window.setInterval(async () => {
          if (!win) {
            return;
          }
          try {
            if (win.closed) {
              clearInterval(pollTimer);
              reject(new Error("User closed login window"));
            }
          } catch (e) {
            // silence the error since it'll throw when the user closes it on the google auth page
          }
        }, 1000);

        const messageListener = async (
          event: MessageEvent<{
            eventType: string;
            authResult?: AuthAndWalletRpcReturnType;
            error?: string;
          }>,
        ) => {
          if (event.origin !== GET_IFRAME_BASE_URL()) {
            return;
          }
          if (typeof event.data !== "object") {
            reject(new Error("Invalid event data"));
            return;
          }
          window.removeEventListener("message", messageListener);
          clearInterval(pollTimer);

          switch (event.data.eventType) {
            case "userLoginSuccess": {
              win?.close();
              if (event.data.authResult) {
                resolve(event.data.authResult);
              }
              break;
            }
            case "userLoginFailed": {
              win?.close();
              reject(new Error(event.data.error));
              break;
            }
          }
        };
        window.addEventListener("message", messageListener);
      },
    );
    return this.postLogin({
      storedToken: { ...result.storedToken, shouldStoreCookieString: true },
      walletDetails: { ...result.walletDetails, isIframeStorageEnabled: false },
    });
  }

  override async verifyEmailLoginOtp({
    email,
    otp,
  }: {
    email: string;
    otp: string;
  }): Promise<AuthLoginReturnType> {
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "verifyThirdwebEmailLoginOtp",
      params: { email, otp },
    });
    return this.postLogin(result);
  }
}
