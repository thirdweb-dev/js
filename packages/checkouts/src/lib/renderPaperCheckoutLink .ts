import { PAPER_APP_URL } from "../constants/settings";
import { Drawer } from "./Drawer";

async function sleepForSeconds(seconds: number) {
  return new Promise((res) => {
    setTimeout(() => {
      res(0);
    }, seconds * 1000);
  });
}

export function renderPaperCheckoutLink({
  checkoutLinkUrl,
  onPaymentSucceeded,
  onPaymentFailed,
  onTransferSucceeded,
  onModalClosed,
}: {
  checkoutLinkUrl: string;
  onPaymentSucceeded?: ({ transactionId }: { transactionId: string }) => void;
  onPaymentFailed?: ({ transactionId }: { transactionId: string }) => void;
  onTransferSucceeded?: ({
    transactionId,
    claimedTokens,
  }: {
    transactionId: string;
    claimedTokens: any;
  }) => void;
  onModalClosed?: () => void;
}) {
  const drawer = new Drawer();

  const formattedCheckoutLinkUrl = new URL(checkoutLinkUrl);
  formattedCheckoutLinkUrl.searchParams.set("display", "DRAWER");
  drawer.open({ iframeUrl: formattedCheckoutLinkUrl.href });
  if (onModalClosed) {
    drawer.setOnCloseCallback(onModalClosed);
  }

  const messageHandler = async (e: MessageEvent) => {
    if (e.origin !== PAPER_APP_URL) {
      return;
    }
    const result = e.data;
    if (!result.eventType) {
      return;
    }
    switch (result.eventType) {
      case "paymentSuccess": {
        const transactionId = e.data.id;
        onPaymentSucceeded?.({ transactionId });
        break;
      }
      case "claimSuccessful": {
        const { id: transactionId, claimedTokens } = e.data;
        onTransferSucceeded?.({ transactionId, claimedTokens });
        await sleepForSeconds(3.5);
        drawer.close();
        break;
      }
      case "redirectAfterSuccess": {
        const redirectUrl = e.data.redirectUrl;
        window.location.assign(redirectUrl);
        break;
      }
      case "paymentFailed": {
        const transactionId = e.data.id;
        onPaymentFailed?.({ transactionId });
        break;
      }
      case "modalClosed": {
        onModalClosed?.();
        break;
      }
      default:
        throw new Error(`Unsupported eventType ${result.eventType}`);
    }
  };

  window.addEventListener("message", messageHandler);
}
