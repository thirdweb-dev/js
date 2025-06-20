import type { ThirdwebClient } from "../../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../../utils/domains.js";
import type { OAuthOption } from "../../../../../wallets/types.js";
import { getLoginUrl } from "../../../core/authentication/getLoginPath.js";
import type { AuthStoredTokenWithCookieReturnType } from "../../../core/authentication/types.js";
import type { Ecosystem } from "../../../core/wallet/types.js";
import { DEFAULT_POP_UP_SIZE } from "./constants.js";

const closeWindow = ({
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

export async function loginWithOauthRedirect(options: {
  authOption: OAuthOption;
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  redirectUrl?: string;
  mode?: "redirect" | "popup" | "window";
}): Promise<void> {
  const loginUrl = getLoginUrl({
    ...options,
    mode: options.mode || "redirect",
  });
  if (options.mode === "redirect") {
    window.location.href = loginUrl;
  } else {
    window.open(loginUrl);
  }
  // wait for 5 secs for the redirect to happen
  // that way it interrupts the rest of the execution that would normally keep connecting
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

export const loginWithOauth = async (options: {
  authOption: OAuthOption;
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  openedWindow?: Window | null | undefined;
  closeOpenedWindow?: ((openedWindow: Window) => void) | undefined;
}): Promise<AuthStoredTokenWithCookieReturnType> => {
  let win = options.openedWindow;
  let isWindowOpenedByFn = false;
  if (!win) {
    win = window.open(
      getLoginUrl({ ...options, mode: "popup" }),
      `Login to ${options.authOption}`,
      DEFAULT_POP_UP_SIZE,
    );
    isWindowOpenedByFn = true;
  }
  if (!win) {
    throw new Error("Something went wrong opening pop-up");
  }

  const result = await new Promise<AuthStoredTokenWithCookieReturnType>(
    (resolve, reject) => {
      // detect when the user closes the login window
      const pollTimer = window.setInterval(async () => {
        if (win.closed) {
          clearInterval(pollTimer);
          window.removeEventListener("message", messageListener);
          reject(new Error("User closed login window"));
        }
      }, 1000);

      const messageListener = async (
        event: MessageEvent<{
          eventType: string;
          authResult?: AuthStoredTokenWithCookieReturnType;
          errorString?: string;
        }>,
      ) => {
        if (event.origin !== getThirdwebBaseUrl("inAppWallet")) {
          return;
        }
        if (typeof event.data !== "object") {
          reject(new Error("Invalid event data"));
          return;
        }

        switch (event.data.eventType) {
          case "oauthSuccessResult": {
            window.removeEventListener("message", messageListener);
            clearInterval(pollTimer);
            closeWindow({
              closeOpenedWindow: options.closeOpenedWindow,
              isWindowOpenedByFn,
              win,
            });
            if (event.data.authResult) {
              resolve(event.data.authResult);
            }
            break;
          }
          case "oauthFailureResult": {
            window.removeEventListener("message", messageListener);
            clearInterval(pollTimer);
            closeWindow({
              closeOpenedWindow: options.closeOpenedWindow,
              isWindowOpenedByFn,
              win,
            });
            reject(new Error(event.data.errorString));
            break;
          }
          default: {
            // no-op, DO NOT THROW HERE
          }
        }
      };
      window.addEventListener("message", messageListener);
    },
  );
  return result;
};
