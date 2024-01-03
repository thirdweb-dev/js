// CHANGED: packageJson import + version string
// eslint-disable-next-line @typescript-eslint/no-var-requires, better-tree-shaking/no-top-level-side-effects
const packageJson = require("../package.json");

export interface PaperPaymentElementConstructorArgs {
  onLoad?: (event?: Event) => void;
  elementOrId?: string | HTMLElement;
}

export class PaperPaymentElement {
  private elementOrId?: PaperPaymentElementConstructorArgs["elementOrId"];
  private onLoad?: PaperPaymentElementConstructorArgs["onLoad"];

  constructor({ elementOrId, onLoad }: PaperPaymentElementConstructorArgs) {
    this.elementOrId = elementOrId;
    this.onLoad = onLoad;
  }
  createPaymentElement({
    handler,
    link,
    iframeId,
  }: {
    handler: (
      iframe: HTMLIFrameElement,
    ) => (event: MessageEvent) => void | Promise<void>;
    link: URL;
    iframeId: string;
  }) {
    const iframe = document.createElement("iframe");
    iframe.src = link.href;
    iframe.id = iframeId;
    iframe.allow = "payment";
    iframe.setAttribute(
      "style",
      "margin-left:auto; margin-right:auto; width:100%; height: 100%; min-height:375px; transition-property:all; transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1); transition-duration:150ms; color-scheme: light;",
    );
    iframe.onload = (event: Event) => {
      if (this.onLoad) {
        this.onLoad(event);
      }
    };
    iframe.setAttribute(
      "data-thirdweb-sdk-version",
      `${packageJson.name}@${packageJson.version}`,
    );

    if (!this.elementOrId) {
      window.addEventListener("message", handler(iframe));
      return iframe;
    }

    let container: HTMLElement | string = this.elementOrId;
    if (typeof container === "string") {
      const domElement = document.getElementById(container);
      if (!domElement) {
        throw new Error("Invalid id given");
      }
      container = domElement;
    }

    const existing: HTMLIFrameElement | null = container.querySelector(
      "#" + iframeId,
    );
    // if we already created an iframe, consider updating the iframe link if it's new
    if (existing) {
      if (existing.src === link.href) {
        return existing;
      }
      existing.src = link.href;
      return existing;
    }

    window.addEventListener("message", handler(iframe));
    return container.appendChild(iframe);
  }
}
