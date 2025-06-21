import { sleep } from "../../../../../utils/sleep.js";
import type { ClientScopedStorage } from "../../../../../wallets/in-app/core/authentication/client-scoped-storage.js";
import type { Ecosystem } from "../../../../../wallets/in-app/core/wallet/types.js";

type IFrameCommunicatorProps = {
  link: string;
  baseUrl: string;
  iframeId: string;
  container?: HTMLElement;
  onIframeInitialize?: () => void;
  localStorage: ClientScopedStorage;
  clientId: string;
  ecosystem?: Ecosystem;
};

const iframeBaseStyle = {
  backgroundColor: "transparent",
  border: "none",
  colorScheme: "light",
  display: "none",
  height: "100%",
  pointerEvents: "all",
  position: "fixed",
  right: "0px",
  top: "0px",
  width: "100%",
  zIndex: "2147483646",
};

// Global var to help track iframe state
const isIframeLoaded = new Map<string, boolean>();

/**
 * @internal
 */
// biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
export class IframeCommunicator<T extends { [key: string]: any }> {
  private iframe?: HTMLIFrameElement;
  private POLLING_INTERVAL_SECONDS = 1.4;
  private iframeBaseUrl;
  protected localStorage: ClientScopedStorage;
  protected clientId: string;
  protected ecosystem?: Ecosystem;

  /**
   * @internal
   */
  constructor({
    link,
    baseUrl,
    iframeId,
    container,
    onIframeInitialize,
    localStorage,
    clientId,
    ecosystem,
  }: IFrameCommunicatorProps) {
    this.localStorage = localStorage;
    this.clientId = clientId;
    this.ecosystem = ecosystem;
    this.iframeBaseUrl = baseUrl;

    if (typeof document === "undefined") {
      return;
    }
    container = container ?? document.body;
    // Creating the IFrame element for communication
    let iframe = document.getElementById(iframeId) as HTMLIFrameElement | null;
    const hrefLink = new URL(link);

    // TODO (ew) - bring back version tracking
    // const sdkVersion = process.env.THIRDWEB_EWS_SDK_VERSION;
    // if (!sdkVersion) {
    //   throw new Error("Missing THIRDWEB_EWS_SDK_VERSION env var");
    // }
    // hrefLink.searchParams.set("sdkVersion", sdkVersion);
    if (!iframe || iframe.src !== hrefLink.href) {
      // ! Do not update the hrefLink here or it'll cause multiple re-renders

      iframe = document.createElement("iframe");
      const mergedIframeStyles = {
        ...iframeBaseStyle,
      };
      Object.assign(iframe.style, mergedIframeStyles);
      iframe.setAttribute("id", iframeId);
      iframe.setAttribute("fetchpriority", "high");
      container.appendChild(iframe);

      iframe.src = hrefLink.href;

      // iframe.setAttribute("data-version", sdkVersion);
      // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
      const onIframeLoaded = (event: MessageEvent<any>) => {
        if (event.data.eventType === "ewsIframeLoaded") {
          window.removeEventListener("message", onIframeLoaded);
          if (!iframe) {
            console.warn("thirdweb iFrame not found");
            return;
          }
          this.onIframeLoadHandler(iframe, onIframeInitialize)();
        }
      };
      window.addEventListener("message", onIframeLoaded);
    }
    this.iframe = iframe;
  }

  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
  protected async onIframeLoadedInitVariables(): Promise<Record<string, any>> {
    return {
      authCookie: await this.localStorage.getAuthCookie(),
      clientId: this.clientId,
      deviceShareStored: await this.localStorage.getDeviceShare(),
      ecosystemId: this.ecosystem?.id,
      partnerId: this.ecosystem?.partnerId,
      walletUserId: await this.localStorage.getWalletUserId(),
    };
  }

  /**
   * @internal
   */
  onIframeLoadHandler(
    iframe: HTMLIFrameElement,
    onIframeInitialize?: () => void,
  ) {
    return async () => {
      const channel = new MessageChannel();

      const promise = new Promise((res, rej) => {
        // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
        channel.port1.onmessage = (event: any) => {
          const { data } = event;
          channel.port1.close();
          if (!data.success) {
            rej(new Error(data.error));
          }
          isIframeLoaded.set(iframe.src, true);
          if (onIframeInitialize) {
            onIframeInitialize();
          }
          res(true);
        };
      });

      iframe?.contentWindow?.postMessage(
        {
          data: await this.onIframeLoadedInitVariables(),
          eventType: "initIframe",
        },
        this.iframeBaseUrl,
        [channel.port2],
      );

      await promise;
    };
  }

  /**
   * @internal
   */
  async call<ReturnData>({
    procedureName,
    params,
    showIframe = false,
  }: {
    procedureName: keyof T;
    params: T[keyof T];
    showIframe?: boolean;
  }) {
    if (!this.iframe) {
      throw new Error(
        "Iframe not found. You are likely calling this from the backend where the DOM is not available.",
      );
    }
    while (!isIframeLoaded.get(this.iframe.src)) {
      await sleep(this.POLLING_INTERVAL_SECONDS * 1000);
    }
    if (showIframe) {
      this.iframe.style.display = "block";
      // magic number to let the display render before performing the animation of the modal in
      await sleep(0.005 * 1000);
    }

    const channel = new MessageChannel();
    const promise = new Promise<ReturnData>((res, rej) => {
      // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
      channel.port1.onmessage = async (event: any) => {
        const { data } = event;
        channel.port1.close();
        if (showIframe) {
          // magic number to let modal fade out before hiding it
          await sleep(0.1 * 1000);
          if (this.iframe) {
            this.iframe.style.display = "none";
          }
        }
        if (!data.success) {
          rej(new Error(data.error));
        } else {
          res(data.data);
        }
      };
    });

    this.iframe.contentWindow?.postMessage(
      {
        // Pass the initialization data on every request in case the iframe storage was reset (can happen in some environments such as iOS PWAs)
        data: {
          ...params,
          ...(await this.onIframeLoadedInitVariables()),
        },
        eventType: procedureName,
      },
      this.iframeBaseUrl,
      [channel.port2],
    );
    return promise;
  }

  /**
   * This has to be called by any iframe that will be removed from the DOM.
   * Use to make sure that we reset the global loaded state of the particular iframe.src
   * @internal
   */
  destroy() {
    if (this.iframe) {
      isIframeLoaded.delete(this.iframe.src);
    }
  }
}
