import {
  EMBEDDED_WALLET_PATH,
  GET_IFRAME_BASE_URL,
} from "../../constants/settings.js";
import { LocalStorage } from "../Storage/LocalStorage.js";
import { IframeCommunicator } from "./IframeCommunicator.js";

/**
 * @internal
 */
export class EmbeddedWalletIframeCommunicator<
  T extends { [key: string]: any },
> extends IframeCommunicator<T> {
  clientId: string;
  /**
   * @internal
   */
  constructor({ clientId }: { clientId: string }) {
    super({
      iframeId: EMBEDDED_WALLET_IFRAME_ID,
      link: createEmbeddedWalletIframeLink({
        clientId,
        path: EMBEDDED_WALLET_PATH,
      }).href,
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
export function createEmbeddedWalletIframeLink({
  clientId,
  path,
  queryParams,
}: {
  clientId: string;
  path: string;
  queryParams?: { [key: string]: string | number };
}) {
  const embeddedWalletUrl = new URL(`${path}`, GET_IFRAME_BASE_URL());
  if (queryParams) {
    for (const queryKey of Object.keys(queryParams)) {
      embeddedWalletUrl.searchParams.set(
        queryKey,
        queryParams[queryKey]?.toString() || "",
      );
    }
  }
  embeddedWalletUrl.searchParams.set("clientId", clientId);
  return embeddedWalletUrl;
}
export const EMBEDDED_WALLET_IFRAME_ID = "thirdweb-embedded-wallet-iframe";
