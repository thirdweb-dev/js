import { webLocalStorage } from "../../../../../utils/storage/webStorage.js";
import { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import { IN_APP_WALLET_PATH } from "../../../core/constants/settings.js";
import type { Ecosystem } from "../../../core/wallet/types.js";
import { IframeCommunicator } from "./IframeCommunicator.js";

/**
 * @internal
 */
export class InAppWalletIframeCommunicator<
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
  T extends { [key: string]: any },
> extends IframeCommunicator<T> {
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
      baseUrl,
      clientId,
      container: typeof document === "undefined" ? undefined : document.body,
      ecosystem,
      iframeId: IN_APP_WALLET_IFRAME_ID + (ecosystem?.id || ""),
      link: createInAppWalletIframeLink({
        baseUrl,
        clientId,
        ecosystem,
        path: IN_APP_WALLET_PATH,
      }).href,
      localStorage: new ClientScopedStorage({
        clientId,
        ecosystem,
        storage: webLocalStorage,
      }),
    });
    this.clientId = clientId;
    this.ecosystem = ecosystem;
  }
}

// This is the URL and ID tag of the iFrame that we communicate with
/**
 * @internal
 */
function createInAppWalletIframeLink({
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
const IN_APP_WALLET_IFRAME_ID = "thirdweb-in-app-wallet-iframe";
