import type { MessageType, StyleObject } from "@paperxyz/sdk-common-utilities";
import { getPaperOriginUrl } from "@paperxyz/sdk-common-utilities";
import { EMBEDDED_WALLET_PATH } from "../../constants/settings";

type IFrameCommunicatorProps = {
  link: string;
  iframeId: string;
  container?: HTMLElement;
  iframeStyles?: StyleObject;
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

export class IframeCommunicator<T extends { [key: string]: any }> {
  private iframe: HTMLIFrameElement;
  private POLLING_INTERVAL_SECONDS = 1.4;
  private POST_LOAD_BUFFER_SECONDS = 1;

  constructor({
    link,
    iframeId,
    container = document.body,
    iframeStyles,
    onIframeInitialize,
  }: IFrameCommunicatorProps) {
    // Creating the IFrame element for communication
    let iframe = document.getElementById(iframeId) as HTMLIFrameElement | null;
    const hrefLink = new URL(link);
    const sdkVersion = process.env.SDK_VERSION;
    if (!sdkVersion) {
      throw new Error("Missing SDK_VERSION env var");
    }
    hrefLink.searchParams.set("sdkVersion", sdkVersion);
    if (!iframe || iframe.src != hrefLink.href) {
      // ! Do not update the hrefLink here or it'll cause multiple re-renders
      if (!iframe) {
        iframe = document.createElement("iframe");
        const mergedIframeStyles = {
          ...iframeBaseStyle,
          ...iframeStyles,
        };
        Object.assign(iframe.style, mergedIframeStyles);
        iframe.setAttribute("id", iframeId);
        iframe.setAttribute("fetchpriority", "high");
        container.appendChild(iframe);
      }
      iframe.src = hrefLink.href;
      iframe.setAttribute("data-version", sdkVersion);
      iframe.onload = this.onIframeLoadHandler(
        iframe,
        this.POST_LOAD_BUFFER_SECONDS,
        onIframeInitialize,
      );
    }
    this.iframe = iframe;
  }

  protected async onIframeLoadedInitVariables(): Promise<Record<string, any>> {
    return {};
  }

  onIframeLoadHandler(
    iframe: HTMLIFrameElement,
    prePostMessageSleepInSeconds: number,
    onIframeInitialize?: () => void,
  ) {
    return async () => {
      const promise = new Promise<boolean>(async (res, rej) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event: MessageEvent<MessageType<void>>) => {
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
        // iFrame takes a bit of time after loading to be ready for message receiving
        // This is hacky
        await sleep(prePostMessageSleepInSeconds);
        const INIT_IFRAME_EVENT = "initIframe";
        iframe?.contentWindow?.postMessage(
          // ? We initialise the iframe with a bunch
          // of useful information so that we don't have to pass it
          // through in each of the future call. This would be where we do it.
          {
            eventType: INIT_IFRAME_EVENT,
            data: await this.onIframeLoadedInitVariables(),
          },
          `${getPaperOriginUrl()}${EMBEDDED_WALLET_PATH}`,
          [channel.port2],
        );
      });
      await promise;
    };
  }

  async call<ReturnData>({
    procedureName,
    params,
    showIframe = false,
    injectRecoveryCode = { isInjectRecoveryCode: false },
  }: {
    procedureName: keyof T;
    params: T[keyof T];
    showIframe?: boolean;
    injectRecoveryCode?: {
      getRecoveryCode?: (userWalletId: string) => Promise<string | undefined>;
      isInjectRecoveryCode: boolean;
    };
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
      if (injectRecoveryCode.isInjectRecoveryCode) {
        const injectRecoveryCodeListener = async (
          e: MessageEvent<{ type: string; userWalletId: string }>,
        ) => {
          if (
            e.origin !== getPaperOriginUrl() ||
            e.data.type !== "paper_getRecoveryCode" ||
            typeof e.data.userWalletId !== "string"
          ) {
            return;
          }
          const recoveryCode = await injectRecoveryCode.getRecoveryCode?.(
            e.data.userWalletId,
          );
          this.iframe.contentWindow?.postMessage(
            { type: "paper_getRecoveryCode_response", recoveryCode },
            getPaperOriginUrl(),
          );
          window.removeEventListener("message", injectRecoveryCodeListener);
        };
        window.addEventListener("message", injectRecoveryCodeListener);
      }

      const channel = new MessageChannel();
      channel.port1.onmessage = async (
        event: MessageEvent<MessageType<ReturnData>>,
      ) => {
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
        `${getPaperOriginUrl()}${EMBEDDED_WALLET_PATH}`,
        [channel.port2],
      );
    });
    return promise;
  }

  /**
   * This has to be called by any iframe that will be removed from the DOM.
   * Use to make sure that we reset the global loaded state of the particular iframe.src
   */
  destroy() {
    isIframeLoaded.delete(this.iframe.src);
  }
}
