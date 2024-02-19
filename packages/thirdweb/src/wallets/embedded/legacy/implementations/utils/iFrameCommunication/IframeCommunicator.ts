import { GET_IFRAME_BASE_URL } from "../../constants/settings.js";

type IFrameCommunicatorProps = {
  link: string;
  iframeId: string;
  container?: HTMLElement;
  onIframeInitialize?: () => void;
};

function sleep(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

const iframeBaseStyle = {
  height: "100%",
  width: "100%",
  border: "none",
  backgroundColor: "transparent",
  colorScheme: "light",
  position: "fixed",
  top: "0px",
  right: "0px",
  zIndex: "2147483646",
  display: "none",
};

// Global var to help track iframe state
const isIframeLoaded = new Map<string, boolean>();

/**
 * @internal
 */
export class IframeCommunicator<T extends { [key: string]: any }> {
  private iframe: HTMLIFrameElement;
  private POLLING_INTERVAL_SECONDS = 1.4;

  private iframeBaseUrl;
  /**
   * @internal
   */
  constructor({
    link,
    iframeId,
    container = document.body,
    onIframeInitialize,
  }: IFrameCommunicatorProps) {
    this.iframeBaseUrl = GET_IFRAME_BASE_URL();

    // Creating the IFrame element for communication
    let iframe = document.getElementById(iframeId) as HTMLIFrameElement | null;
    const hrefLink = new URL(link);
    const sdkVersion = process.env.THIRDWEB_EWS_SDK_VERSION;
    if (!sdkVersion) {
      throw new Error("Missing THIRDWEB_EWS_SDK_VERSION env var");
    }
    hrefLink.searchParams.set("sdkVersion", sdkVersion);
    if (!iframe || iframe.src !== hrefLink.href) {
      // ! Do not update the hrefLink here or it'll cause multiple re-renders
      if (!iframe) {
        iframe = document.createElement("iframe");
        const mergedIframeStyles = {
          ...iframeBaseStyle,
        };
        Object.assign(iframe.style, mergedIframeStyles);
        iframe.setAttribute("id", iframeId);
        iframe.setAttribute("fetchpriority", "high");
        container.appendChild(iframe);
      }
      iframe.src = hrefLink.href;
      iframe.setAttribute("data-version", sdkVersion);

      const onIframeLoaded = (event: MessageEvent<any>) => {
        if (event.data.eventType === "ewsIframeLoaded") {
          window.removeEventListener("message", onIframeLoaded);
          if (!iframe) {
            console.warn("thirdweb Iframe not found");
            return;
          }
          this.onIframeLoadHandler(iframe, onIframeInitialize)();
        }
      };
      window.addEventListener("message", onIframeLoaded);
    }
    this.iframe = iframe;
  }

  protected async onIframeLoadedInitVariables(): Promise<Record<string, any>> {
    return {};
  }

  /**
   * @internal
   */
  onIframeLoadHandler(
    iframe: HTMLIFrameElement,
    onIframeInitialize?: () => void,
  ) {
    return async () => {
      const promise = new Promise<boolean>(async (res, rej) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event: any) => {
          const { data } = event;
          channel.port1.close();
          if (!data.success) {
            return rej(new Error(data.error));
          }
          isIframeLoaded.set(iframe.src, true);
          if (onIframeInitialize) {
            onIframeInitialize();
          }
          return res(true);
        };

        const INIT_IFRAME_EVENT = "initIframe";
        iframe?.contentWindow?.postMessage(
          // ? We initialise the iframe with a bunch
          // of useful information so that we don't have to pass it
          // through in each of the future call. This would be where we do it.
          {
            eventType: INIT_IFRAME_EVENT,
            data: await this.onIframeLoadedInitVariables(),
          },
          this.iframeBaseUrl,
          [channel.port2],
        );
      });
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
    while (!isIframeLoaded.get(this.iframe.src)) {
      await sleep(this.POLLING_INTERVAL_SECONDS);
    }
    if (showIframe) {
      this.iframe.style.display = "block";
      // magic number to let the display render before performing the animation of the modal in
      await sleep(0.005);
    }
    const promise = new Promise<ReturnData>((res, rej) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = async (event: any) => {
        const { data } = event;
        channel.port1.close();
        if (showIframe) {
          // magic number to let modal fade out before hiding it
          await sleep(0.1);
          this.iframe.style.display = "none";
        }
        if (!data.success) {
          rej(new Error(data.error));
        } else {
          res(data.data);
        }
      };
      this.iframe.contentWindow?.postMessage(
        { eventType: procedureName, data: params },
        this.iframeBaseUrl,
        [channel.port2],
      );
    });
    return promise;
  }

  /**
   * This has to be called by any iframe that will be removed from the DOM.
   * Use to make sure that we reset the global loaded state of the particular iframe.src
   * @internal
   */
  destroy() {
    isIframeLoaded.delete(this.iframe.src);
  }
}
