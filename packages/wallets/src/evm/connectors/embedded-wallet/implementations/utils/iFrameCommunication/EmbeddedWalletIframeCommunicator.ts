import type { CustomizationOptionsType } from "@paperxyz/sdk-common-utilities";
import {
  EMBEDDED_WALLET_PATH,
  GET_IFRAME_BASE_URL,
} from "../../constants/settings";
import { LocalStorage } from "../Storage/LocalStorage";
import { IframeCommunicator } from "./IframeCommunicator";

export class EmbeddedWalletIframeCommunicator<
  T extends { [key: string]: any },
> extends IframeCommunicator<T> {
  clientId: string;
  constructor({
    clientId,
    customizationOptions,
  }: {
    clientId: string;
    customizationOptions?: CustomizationOptionsType;
  }) {
    super({
      iframeId: EMBEDDED_WALLET_IFRAME_ID,
      link: createEmbeddedWalletIframeLink({
        clientId,
        path: EMBEDDED_WALLET_PATH,
        queryParams: customizationOptions,
      }).href,
      container: document.body,
    });
    this.clientId = clientId;
  }

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
function createEmbeddedWalletIframeLink({
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
const EMBEDDED_WALLET_IFRAME_ID = "thirdweb-embedded-wallet-iframe";
