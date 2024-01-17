import { GET_IFRAME_BASE_URL } from "../../constants/settings";
import {
  AuthProvider,
  type AuthAndWalletRpcReturnType,
  type AuthLoginReturnType,
  type GetHeadlessLoginLinkReturnType,
} from "../../interfaces/auth";
import { AbstractLogin, LoginQuerierTypes } from "./abstract-login";

export class BaseLogin extends AbstractLogin<
  void,
  { email: string },
  { email: string; otp: string; recoveryCode?: string }
> {
  private async getOauthLoginUrl(
    authProvider: AuthProvider,
  ): Promise<GetHeadlessLoginLinkReturnType> {
    const result = await this.LoginQuerier.call<GetHeadlessLoginLinkReturnType>(
      {
        procedureName: "getHeadlessOauthLoginLink",
        params: { authProvider },
      },
    );
    return result;
  }

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

  private closeWindow = ({
    isWindowOpenedByFn,
    win,
    closeOpenedWindow,
  }: {
    win?: Window | null;
    isWindowOpenedByFn: boolean;
    closeOpenedWindow?: (openedWindow: Window) => void;
  }) => {
    if (isWindowOpenedByFn) {
      win?.close();
    } else {
      if (win && closeOpenedWindow) {
        closeOpenedWindow(win);
      } else if (win) {
        win.close();
      }
    }
  };

  private getOauthPopUpSizing(authProvider: AuthProvider) {
    switch (authProvider) {
      case AuthProvider.FACEBOOK:
        return "width=715, height=555";
      default:
        return "width=350, height=500";
    }
  }

  override async loginWithOauth(args: {
    oauthProvider: AuthProvider;
    openedWindow?: Window | null | undefined;
    closeOpenedWindow?: ((openedWindow: Window) => void) | undefined;
  }): Promise<AuthLoginReturnType> {
    let win = args?.openedWindow;
    let isWindowOpenedByFn = false;
    if (!win) {
      win = window.open(
        "",
        "Login",
        this.getOauthPopUpSizing(args.oauthProvider),
      );
      isWindowOpenedByFn = true;
    }
    if (!win) {
      throw new Error("Something went wrong opening pop-up");
    }
    // logout the user
    // fetch the url to open the login window from iframe
    const [{ loginLink }] = await Promise.all([
      this.getOauthLoginUrl(args.oauthProvider),
      this.preLogin(),
    ]);
    win.location.href = loginLink;
    // listen to result from the login window
    const result = await new Promise<AuthAndWalletRpcReturnType>(
      (resolve, reject) => {
        // detect when the user closes the login window
        const pollTimer = window.setInterval(async () => {
          if (!win) {
            return;
          }
          if (win.closed) {
            clearInterval(pollTimer);
            window.removeEventListener("message", messageListener);
            reject(new Error("User closed login window"));
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

          switch (event.data.eventType) {
            case "userLoginSuccess": {
              window.removeEventListener("message", messageListener);
              clearInterval(pollTimer);
              this.closeWindow({
                isWindowOpenedByFn,
                win,
                closeOpenedWindow: args?.closeOpenedWindow,
              });
              if (event.data.authResult) {
                resolve(event.data.authResult);
              }
              break;
            }
            case "userLoginFailed": {
              window.removeEventListener("message", messageListener);
              clearInterval(pollTimer);
              this.closeWindow({
                isWindowOpenedByFn,
                win,
                closeOpenedWindow: args?.closeOpenedWindow,
              });
              reject(new Error(event.data.error));
              break;
            }
            case "injectDeveloperClientId": {
              win?.postMessage(
                {
                  eventType: "injectDeveloperClientIdResult",
                  developerClientId: this.clientId,
                  authOption: args.oauthProvider,
                },
                GET_IFRAME_BASE_URL(),
              );
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

  override async loginWithCustomJwt({
    encryptionKey,
    jwt,
  }: LoginQuerierTypes["loginWithCustomJwt"]): Promise<AuthLoginReturnType> {
    await this.preLogin();
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "loginWithCustomJwt",
      params: { encryptionKey, jwt },
    });
    return this.postLogin(result);
  }

  override async loginWithCustomAuthEndpoint({
    encryptionKey,
    payload,
  }: LoginQuerierTypes["loginWithCustomAuthEndpoint"]): Promise<AuthLoginReturnType> {
    await this.preLogin();
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "loginWithCustomAuthEndpoint",
      params: { encryptionKey, payload },
    });
    return this.postLogin(result);
  }

  override async verifyEmailLoginOtp({
    email,
    otp,
    recoveryCode,
  }: LoginQuerierTypes["verifyThirdwebEmailLoginOtp"]): Promise<AuthLoginReturnType> {
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "verifyThirdwebEmailLoginOtp",
      params: { email, otp, recoveryCode },
    });
    return this.postLogin(result);
  }
}
