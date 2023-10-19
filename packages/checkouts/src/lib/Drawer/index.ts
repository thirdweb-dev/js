import type { StyleObject } from "@paperxyz/sdk-common-utilities";
import type { ModalStyles } from "../../interfaces/Modal";
import { getDefaultModalStyles } from "./styles";

const MAIN_CLASSNAME = "paper--drawer-main";
const OVERLAY_CLASSNAME = "paper--drawer-overlay";
const BODY_CLASSNAME = "paper--drawer-body";
const CLOSE_CLASSNAME = "paper--drawer-close";

export class Drawer {
  protected container: HTMLElement;
  protected main: HTMLDivElement;
  protected overlay: HTMLDivElement;
  protected closeButton: HTMLButtonElement;
  protected iframe: HTMLIFrameElement;
  protected onCloseCallback: (() => void) | undefined;

  protected closeTimeout: number | undefined;
  styles = getDefaultModalStyles();
  body: HTMLDivElement;

  constructor(container?: HTMLElement, styles?: Partial<ModalStyles>) {
    this.container = container || document.body;

    if (styles) {
      this.mergeStyles(styles);
    }

    this.main = document.createElement("div");
    this.main.className = MAIN_CLASSNAME;

    this.overlay = document.createElement("div");
    this.overlay.className = OVERLAY_CLASSNAME;

    this.body = document.createElement("div");
    this.body.className = BODY_CLASSNAME;

    this.closeButton = document.createElement("button");
    this.closeButton.className = CLOSE_CLASSNAME;
    this.closeButton.innerHTML = "&#x2715;";
    this.closeButton.onclick = () => {
      this.close();
    };

    this.iframe = document.createElement("iframe");
    this.iframe.allow = "camera; microphone; payment";

    this.assignStyles(this.main, this.styles.main);
    this.assignStyles(this.overlay, this.styles.overlay);
    this.assignStyles(this.body, this.styles.body);
    this.assignStyles(this.iframe, this.styles.iframe);
    if (this.styles.closeButton) {
      this.assignStyles(this.closeButton, this.styles.closeButton);
    }
  }

  open({ iframeUrl }: { iframeUrl?: string } = {}) {
    if (iframeUrl) {
      this.iframe.src = iframeUrl;
      this.body.appendChild(this.iframe);
    }

    this.addAccessibility();

    this.main.appendChild(this.overlay);
    this.main.appendChild(this.body);
    this.main.appendChild(this.closeButton);

    this.container.appendChild(this.main);
    document.body.style.overflow = "hidden";

    // Animate in.
    this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    this.body.style.right = "0px";
    this.body.style.opacity = "1";

    return this.iframe;
  }

  close() {
    this.closeButton.remove();

    // Animate out.
    this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0)";
    this.body.style.right = "-100px";
    this.body.style.opacity = "0";

    // Remove drawer from DOM.
    this.closeTimeout = window.setTimeout(() => {
      document.body.style.overflow = "visible";
      this.main.remove();

      window.clearTimeout(this.closeTimeout);
      this.onCloseCallback?.();
    }, 250);
  }

  setOnCloseCallback(callback: () => void) {
    this.onCloseCallback = callback;
  }

  protected mergeStyles(styles: Partial<ModalStyles>) {
    this.styles.body = {
      ...this.styles.body,
      ...(styles.body || {}),
    };

    this.styles.overlay = {
      ...this.styles.overlay,
      ...(styles.overlay || {}),
    };

    this.styles.main = {
      ...this.styles.main,
      ...(styles.main || {}),
    };

    this.styles.iframe = {
      ...this.styles.iframe,
      ...(styles.iframe || {}),
    };

    this.styles.closeButton = {
      ...this.styles.closeButton,
      ...(styles.closeButton || {}),
    };
  }

  protected addAccessibility() {
    this.main.setAttribute("aria-hidden", "true");
    this.overlay.setAttribute("aria-hidden", "true");
    this.body.setAttribute("aria-modal", "true");
    this.body.setAttribute("role", "dialog");
  }

  protected assignStyles(el: HTMLElement, styles: StyleObject) {
    Object.assign(el.style, styles);
  }
}
