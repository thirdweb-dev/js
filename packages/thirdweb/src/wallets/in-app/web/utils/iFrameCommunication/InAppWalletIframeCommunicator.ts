import { IN_APP_WALLET_PATH } from "../../../core/constants/settings.js";
import { LocalStorage } from "../Storage/LocalStorage.js";
import { IframeCommunicator } from "./IframeCommunicator.js";

/**
 * @internal
 */
export class InAppWalletIframeCommunicator<
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
  T extends { [key: string]: any },
> extends IframeCommunicator<T> {
  clientId: string;
  /**
   * @internal
   */
  constructor({ clientId, baseUrl }: { clientId: string; baseUrl: string }) {
    super({
      iframeId: IN_APP_WALLET_IFRAME_ID,
      link: createInAppWalletIframeLink({
        clientId,
        path: IN_APP_WALLET_PATH,
        baseUrl,
      }).href,
      baseUrl,
      container: document.body,
    });
    this.clientId = clientId;
  }

  /**
   * @internal
   */
  override async onIframeLoadedInitVariables() {
    const localStorage = new LocalStorage({
      clientId: this.clientId,
    });

    return {
      authCookie: await localStorage.getAuthCookie(),
      deviceShareStored: await localStorage.getDeviceShare(),
      walletUserId: await localStorage.getWalletUserId(),
      clientId: this.clientId,
    };
  }
}

// This is the URL and ID tag of the iFrame that we communicate with
/**
 * @internal
 */
export function createInAppWalletIframeLink({
  clientId,
  baseUrl,
  path,
  queryParams,
}: {
  clientId: string;
  baseUrl: string;
  path: string;
  queryParams?: { [key: string]: string | number };
}) {
  const inAppWalletUrl = new URL(`${path}`, baseUrl);
  if (queryParams) {
    for (const queryKey of Object.keys(queryParams)) {
      inAppWalletUrl.searchParams.set(
        queryKey,
        queryParams[queryKey]?.toString() || "",
      );
    }
  }
  inAppWalletUrl.searchParams.set("clientId", clientId);
  return inAppWalletUrl;
}
export const IN_APP_WALLET_IFRAME_ID = "thirdweb-in-app-wallet-iframe";
