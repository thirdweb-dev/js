import type { ThirdwebClient } from "../../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../../utils/domains.js";
import type { AuthStoredTokenWithCookieReturnType } from "../../../../../wallets/in-app/core/authentication/type.js";
import type { Ecosystem } from "../../types.js";
import { DEFAULT_POP_UP_SIZE } from "./constants.js";
import { closeWindow } from "./utils.js";

export const getDiscordLoginPath = (
  client: ThirdwebClient,
  ecosystem?: Ecosystem,
) => {
  const baseUrl = `${getThirdwebBaseUrl("inAppWallet")}/api/2024-05-05/login/discord?clientId=${client.clientId}`;
  if (ecosystem?.partnerId) {
    return `${baseUrl}&ecosystemId=${ecosystem.id}&ecosystemPartnerId=${ecosystem.partnerId}`;
  }
  if (ecosystem) {
    return `${baseUrl}&ecosystemId=${ecosystem.id}`;
  }
  return baseUrl;
};

export async function loginWithDiscord(options: {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  openedWindow?: Window | null | undefined;
  closeOpenedWindow?: ((openedWindow: Window) => void) | undefined;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  let win = options.openedWindow;
  let isWindowOpenedByFn = false;
  if (!win) {
    win = window.open(
      getDiscordLoginPath(options.client, options.ecosystem),
      "Login to discord",
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
              isWindowOpenedByFn,
              win,
              closeOpenedWindow: options.closeOpenedWindow,
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
              isWindowOpenedByFn,
              win,
              closeOpenedWindow: options.closeOpenedWindow,
            });
            reject(new Error(event.data.errorString));
            break;
          }
          default: {
            reject(new Error(`Invalid event type: ${event.data.eventType}`));
          }
        }
      };
      window.addEventListener("message", messageListener);
    },
  );
  return result;
}
