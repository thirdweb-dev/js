// CHANGED: imports only
import { PAPER_APP_URL, DEFAULT_BRAND_OPTIONS } from "@thirdweb-dev/payments";
import React, { useEffect, useState } from "react";
import type {
  ContractType,
  CustomContractArgWrapper,
  ReadMethodCallType,
  WriteMethodCallType,
} from "../interfaces/CustomContract";
import { fetchCustomContractArgsFromProps } from "../interfaces/CustomContract";
import type { PaymentSuccessResult } from "../interfaces/PaymentSuccessResult";
import type { TransferSuccessResult } from "../interfaces/TransferSuccessResult";
import { openCenteredPopup } from "../lib/utils/popup";

export enum PaperCheckoutDisplay {
  /**
   * Open the checkout in a new popup centered over the parent window.
   */
  POPUP = "POPUP",

  /**
   * Open the checkout in a new browser tab.
   */
  NEW_TAB = "NEW_TAB",

  /**
   * Open the checkout in a modal on the parent page with a darkened background.
   *
   * NOTE: Pay with Crypto is disabled in this display mode.
   */
  MODAL = "MODAL",

  /**
   * Open the checkout in a drawer on the right side of the parent page with a darkened background.
   *
   * NOTE: Pay with Crypto is disabled in this display mode.
   */
  DRAWER = "DRAWER",

  /**
   * Embed the checkout directly on the parent page.
   *
   * NOTE: Pay with Crypto is disabled in this display mode.
   */
  EMBED = "EMBED",
}

export type PaperCheckoutProps<T extends ContractType> =
  CustomContractArgWrapper<
    {
      checkoutId: string;
      display?: PaperCheckoutDisplay;
      recipientWalletAddress?: string;
      emailAddress?: string;
      quantity?: number;
      mintMethod?: WriteMethodCallType;
      eligibilityMethod?: ReadMethodCallType;
      metadata?: Record<string, any>;
      appName?: string;
      onOpenCheckout?: () => void;
      onCloseCheckout?: () => void;
      onPaymentSuccess?: (result: PaymentSuccessResult) => void;
      onTransferSuccess?: (result: TransferSuccessResult) => void;
      options?: {
        width: number;
        height: number;
        colorPrimary: string;
        colorBackground: string;
        colorText: string;
        borderRadius: number;
        fontFamily: string;
      };
      children?: React.ReactNode;
    },
    T
  >;

export const PaperCheckout = <T extends ContractType>({
  checkoutId,
  display = PaperCheckoutDisplay.POPUP,
  recipientWalletAddress,
  emailAddress,
  quantity,
  eligibilityMethod,
  mintMethod,
  metadata,
  appName,
  options = {
    width: 400,
    height: 800,
    ...DEFAULT_BRAND_OPTIONS,
  },
  onOpenCheckout,
  onCloseCheckout,
  onPaymentSuccess,
  onTransferSuccess,
  children,
  ...props
}: PaperCheckoutProps<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { contractType, contractArgs } =
    fetchCustomContractArgsFromProps(props);

  // Handle message events from iframe.
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;

      switch (data.eventType) {
        case "paymentSuccess":
          if (onPaymentSuccess) {
            onPaymentSuccess({ id: data.id });
          }
          break;

        case "transferSuccess":
          if (onTransferSuccess) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onTransferSuccess({
              id: data.id,
              // ...
            });
          }
          break;

        case "modalClosed":
          // Emitted when the iframe decides to close, such as when the purchase is completed.
          setIsOpen(false);
          if (onCloseCheckout) {
            onCloseCheckout();
          }
          break;

        default:
        // Ignore unrecognized event
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onCloseCheckout, onPaymentSuccess, onTransferSuccess]);

  // Build iframe URL with query params.
  const checkoutUrl = new URL(`/checkout/${checkoutId}`, PAPER_APP_URL);

  checkoutUrl.searchParams.append("display", display);
  const mintMethodStringified = JSON.stringify(mintMethod);
  const eligibilityMethodStringified = JSON.stringify(eligibilityMethod);
  const metadataStringified = JSON.stringify(metadata);
  const contractArgsStringified = JSON.stringify(contractArgs);

  if (options.colorPrimary) {
    checkoutUrl.searchParams.append("colorPrimary", options.colorPrimary);
  }
  if (options.colorBackground) {
    checkoutUrl.searchParams.append("colorBackground", options.colorBackground);
  }
  if (options.colorText) {
    checkoutUrl.searchParams.append("colorText", options.colorText);
  }
  if (options.borderRadius !== undefined) {
    checkoutUrl.searchParams.append(
      "borderRadius",
      options.borderRadius.toString(),
    );
  }
  if (options.fontFamily) {
    checkoutUrl.searchParams.append("fontFamily", options.fontFamily);
  }
  if (mintMethod) {
    checkoutUrl.searchParams.append(
      "mintMethod",
      Buffer.from(mintMethodStringified, "utf-8").toString("base64"),
    );
  }
  if (eligibilityMethod) {
    checkoutUrl.searchParams.append(
      "eligibilityMethod",
      Buffer.from(eligibilityMethodStringified, "utf-8").toString("base64"),
    );
  }
  if (contractType) {
    checkoutUrl.searchParams.append("contractType", contractType);
  }
  if (contractArgs) {
    checkoutUrl.searchParams.append(
      "contractArgs",
      // Base 64 encode
      Buffer.from(contractArgsStringified, "utf-8").toString("base64"),
    );
  }
  if (appName) {
    checkoutUrl.searchParams.append("appName", appName);
  }
  if (recipientWalletAddress) {
    checkoutUrl.searchParams.append("wallet", recipientWalletAddress);
  }
  if (emailAddress) {
    checkoutUrl.searchParams.append("username", emailAddress);
  }
  if (quantity) {
    checkoutUrl.searchParams.append("quantity", quantity.toString());
  }
  if (metadata) {
    checkoutUrl.searchParams.append(
      "metadata",
      encodeURIComponent(metadataStringified),
    );
  }

  // Default button if the app doesn't pass one in.
  const clickableElement = children || (
    <button
      style={{
        backgroundColor: "#cf3781",
        padding: "8px 20px 8px 20px",
        borderRadius: "8px",
        color: "white",
        fontWeight: "bold",
      }}
    >
      {"Buy Now"}
    </button>
  );

  switch (display) {
    case PaperCheckoutDisplay.POPUP: {
      const onClick = () => {
        openCenteredPopup({
          url: checkoutUrl.href,
          h: options.height,
          w: options.width,
          win: window,
          target: "_blank",
        });

        if (onOpenCheckout) {
          onOpenCheckout();
        }
      };
      return <a onClick={onClick}>{clickableElement}</a>;
    }

    case PaperCheckoutDisplay.NEW_TAB: {
      const onClick = () => {
        window.open(checkoutUrl, "_blank");
        if (onOpenCheckout) {
          onOpenCheckout();
        }
      };
      return <a onClick={onClick}>{clickableElement}</a>;
    }

    case PaperCheckoutDisplay.MODAL: {
      const onOpen = () => {
        setIsOpen(true);
        if (onOpenCheckout) {
          onOpenCheckout();
        }
      };

      const onClose = () => {
        setIsOpen(false);
        if (onCloseCheckout) {
          onCloseCheckout();
        }
      };

      return (
        <PaperCheckoutModal
          clickableElement={clickableElement}
          checkoutUrl={checkoutUrl.href}
          width={options.width}
          height={options.height}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
      );
    }

    case PaperCheckoutDisplay.DRAWER: {
      const onOpen = () => {
        setIsOpen(true);
        if (onOpenCheckout) {
          onOpenCheckout();
        }
      };

      const onClose = () => {
        setIsOpen(false);
        if (onCloseCheckout) {
          onCloseCheckout();
        }
      };

      return (
        <PaperCheckoutDrawer
          clickableElement={clickableElement}
          checkoutUrl={checkoutUrl.href}
          width={options.width}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
      );
    }

    case PaperCheckoutDisplay.EMBED: {
      return (
        <iframe
          src={checkoutUrl.href}
          width={options.width}
          height={options.height}
        />
      );
    }

    default:
      console.error(`Invalid or unimplemented display type: ${display}`);
      return <></>;
  }
};

const inlineStyles: { [name: string]: any } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 0,
    zIndex: 1000,
    overflow: "hidden",
    display: "flex",
    visibility: "hidden",
    opacity: 0,
    transition: "all 0.2s ease",
  },
  overlayIsVisible: {
    visibility: "visible",
    opacity: 1,
    background: "#0008",
  },
  modalOverlay: {
    alignItems: "center",
    justifyContent: "center",
  },
  drawerOverlay: {
    justifyContent: "flex-end",
  },
  modalDialog: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "8px",
    visibility: "hidden",
    opacity: 0,
    top: "5%",
    transition: "all 0.2s ease",
    maxWidth: "100vw",
  },
  modalDialogIsVisible: {
    visibility: "visible",
    opacity: 1,
    top: 0,
  },
  drawerDialog: {
    position: "relative",
    visibility: "hidden",
    opacity: 0,
    right: "-10%",
    transition: "all 0.2s ease",
  },
  drawerDialogIsVisible: {
    visibility: "visible",
    opacity: 1,
    right: 0,
  },
  modalCloseButton: {
    position: "absolute",
    top: "0.1em",
    right: "0.2em",
    borderRadius: "8px",
    fontSize: "x-large",
    padding: "0 0.4em",
    color: "#888",
  },
};

const PaperCheckoutDrawer = ({
  clickableElement,
  checkoutUrl,
  width,
  isOpen,
  onOpen,
  onClose,
}: {
  clickableElement: React.ReactNode;
  checkoutUrl: string;
  width: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  return (
    <>
      <a onClick={onOpen}>{clickableElement}</a>

      <div
        className="paper-overlay"
        style={{
          ...inlineStyles.overlay,
          ...(isOpen ? inlineStyles.overlayIsVisible : {}),
          ...inlineStyles.drawerOverlay,
        }}
      >
        <div
          className="paper-drawer"
          style={{
            ...inlineStyles.drawerDialog,
            ...(isOpen ? inlineStyles.drawerDialogIsVisible : {}),
            width,
          }}
        >
          <button onClick={onClose} style={inlineStyles.modalCloseButton}>
            &times;
          </button>
          {isOpen && <iframe src={checkoutUrl} width="100%" height="100%" />}
        </div>
      </div>
    </>
  );
};

const PaperCheckoutModal = ({
  clickableElement,
  checkoutUrl,
  width,
  height,
  isOpen,
  onOpen,
  onClose,
}: {
  clickableElement: React.ReactNode;
  checkoutUrl: string;
  width: number;
  height: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  // Set the max height to the window's inner height.
  // This method handles mobile browser heights more reliably than 100vh.
  const [innerHeight, setInnerHeight] = useState<number>(height);
  useEffect(() => setInnerHeight(window.innerHeight), []);

  return (
    <>
      <a onClick={onOpen}>{clickableElement}</a>

      <div
        className="paper-overlay"
        style={{
          ...inlineStyles.overlay,
          ...(isOpen ? inlineStyles.overlayIsVisible : {}),
          ...inlineStyles.modalOverlay,
        }}
      >
        <div
          className="paper-modal"
          style={{
            ...inlineStyles.modalDialog,
            ...(isOpen ? inlineStyles.modalDialogIsVisible : {}),
            width,
            height,
            maxHeight: innerHeight,
          }}
        >
          <button onClick={onClose} style={inlineStyles.modalCloseButton}>
            &times;
          </button>
          {isOpen && <iframe src={checkoutUrl} width="100%" height="100%" />}
        </div>
      </div>
    </>
  );
};
