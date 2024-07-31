import { IN_APP_WALLET_PATH } from "../../../core/constants/settings.js";
import type { Ecosystem } from "../../types.js";
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
  ecosystem?: Ecosystem;
  /**
   * @internal
   */
  constructor({
    clientId,
    baseUrl,
    ecosystem,
  }: {
    clientId: string;
    baseUrl: string;
    ecosystem?: Ecosystem;
  }) {
    super({
      iframeId: IN_APP_WALLET_IFRAME_ID + (ecosystem?.id || ""),
      link: createInAppWalletIframeLink({
        clientId,
        path: IN_APP_WALLET_PATH,
        ecosystem,
        baseUrl,
      }).href,
      baseUrl,
      container: document.body,
    });
    this.clientId = clientId;
    this.ecosystem = ecosystem;
  }

  /**
   * @internal
   */
  override async onIframeLoadedInitVariables() {
    const localStorage = new LocalStorage({
      clientId: this.clientId,
      ecosystemId: this.ecosystem?.id,
    });

    return {
      authCookie: await localStorage.getAuthCookie(),
      deviceShareStored: await localStorage.getDeviceShare(),
      walletUserId: await localStorage.getWalletUserId(),
      clientId: this.clientId,
      partnerId: this.ecosystem?.partnerId,
      ecosystemId: this.ecosystem?.id,
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
  ecosystem,
  queryParams,
}: {
  clientId: string;
  baseUrl: string;
  path: string;
  ecosystem?: Ecosystem;
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
  if (ecosystem?.partnerId !== undefined) {
    inAppWalletUrl.searchParams.set("partnerId", ecosystem.partnerId);
  }
  if (ecosystem?.id !== undefined) {
    inAppWalletUrl.searchParams.set("ecosystemId", ecosystem.id);
  }
  return inAppWalletUrl;
}
export const IN_APP_WALLET_IFRAME_ID = "thirdweb-in-app-wallet-iframe";
