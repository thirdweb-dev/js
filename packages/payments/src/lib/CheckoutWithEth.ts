import type { ethers } from "ethers";
import {
  CHECKOUT_WITH_ETH_IFRAME_URL,
  PAPER_APP_URL,
  getPaperOriginUrl,
} from "../constants/settings";
import type {
  ICustomizationOptions,
  Locale,
  DEFAULT_BRAND_OPTIONS,
} from "../constants/style";
import type { PaperSDKError } from "../interfaces/PaperSDKError";
import { PayWithCryptoErrorCode } from "../interfaces/PaperSDKError";
import type { PriceSummary } from "../interfaces/PriceSummary";
import { LinksManager } from "../utils/LinksManager";
import { handlePayWithCryptoError } from "../utils/handleCheckoutWithEthError";
import { postMessageToIframe } from "../utils/postMessageToIframe";
import type { PaperPaymentElementConstructorArgs } from "./CreatePaymentElement";
import { PaperPaymentElement } from "./CreatePaymentElement";

export const PAY_WITH_ETH_ERROR = "payWithEthError";

export async function checkAndSendEth({
  data,
  iframe,
  payingWalletSigner,
  suppressErrorToast,
  onError,
  onPaymentSuccess,
}: {
  payingWalletSigner: ethers.Signer;
  data: {
    chainId: number;
    chainName: string;
    blob: string;
    paymentAddress: string;
    value: string;
    transactionId: string;
  };
  suppressErrorToast: boolean;
  iframe: HTMLIFrameElement;
  onPaymentSuccess?:
    | CheckoutWithEthMessageHandlerArgs["onPaymentSuccess"]
    | CheckoutWithEthMessageHandlerArgs["onSuccess"];
  onError?: (error: PaperSDKError) => Promise<void> | void;
}) {
  try {
    const chainId = await payingWalletSigner.getChainId();
    if (chainId !== data.chainId) {
      throw {
        isErrorObject: true,
        title: PayWithCryptoErrorCode.WrongChain,
        description: `Please change to ${data.chainName} to proceed.`,
      };
    }
  } catch (e) {
    await handlePayWithCryptoError(e as Error, onError, (errorObject) => {
      postMessageToIframe(iframe, PAY_WITH_ETH_ERROR, {
        error: errorObject,
        suppressErrorToast,
      });
    });
    return;
  }

  // send the transaction
  try {
    console.log("sending funds...", data);
    const result = await payingWalletSigner.sendTransaction({
      chainId: data.chainId,
      data: data.blob,
      to: data.paymentAddress,
      value: data.value,
    });
    const receipt = await result.wait();
    if (onPaymentSuccess && result) {
      await onPaymentSuccess({
        onChainTxResponse: result,
        onChainTxReceipt: receipt,
        transactionId: data.transactionId,
      });
    }
    if (result) {
      postMessageToIframe(iframe, "paymentSuccess", {
        suppressErrorToast,
        transactionHash: result.hash,
      });
    }
  } catch (error) {
    console.log("error sending funds", error);
    await handlePayWithCryptoError(error as Error, onError, (errorObject) => {
      postMessageToIframe(iframe, PAY_WITH_ETH_ERROR, {
        error: errorObject,
        suppressErrorToast,
      });
    });
  }
}

export interface CheckoutWithEthMessageHandlerArgs {
  iframe: HTMLIFrameElement;
  onPaymentSuccess?: (props: {
    onChainTxReceipt: ethers.providers.TransactionReceipt;
    transactionId: string;
  }) => Promise<void> | void;
  /** @deprecated */
  onSuccess?: (props: {
    onChainTxResponse: ethers.providers.TransactionResponse;
    transactionId: string;
  }) => Promise<void> | void;
  onPriceUpdate?: (props: PriceSummary) => void;
  onError?: (error: PaperSDKError) => void;
  suppressErrorToast?: boolean;
  setUpUserPayingWalletSigner?: (args: {
    chainId: number;
    chainName?: string;
  }) => void | Promise<void>;
  payingWalletSigner: ethers.Signer;
}

export function createCheckoutWithEthMessageHandler({
  iframe,
  onError,
  onPaymentSuccess,
  onPriceUpdate,
  payingWalletSigner,
  suppressErrorToast = false,
  setUpUserPayingWalletSigner,
}: CheckoutWithEthMessageHandlerArgs) {
  return async (event: MessageEvent) => {
    if (!event.origin.startsWith(PAPER_APP_URL)) {
      return;
    }
    const data = event.data;
    switch (data.eventType) {
      case "payWithEth": {
        if (data.error) {
          await handlePayWithCryptoError(
            new Error(data.error),
            onError,
            (errorObject) => {
              postMessageToIframe(iframe, PAY_WITH_ETH_ERROR, {
                error: errorObject,
                suppressErrorToast,
              });
            },
          );
          return;
        }
        // Allows Dev's to inject any chain switching for their custom signer here.
        if (setUpUserPayingWalletSigner) {
          try {
            console.log("setting up signer");
            await setUpUserPayingWalletSigner({
              chainId: data.chainId,
              chainName: data.chainName,
            });
          } catch (error) {
            console.log("error setting up signer", error);
            await handlePayWithCryptoError(
              error as Error,
              onError,
              (errorObject) => {
                postMessageToIframe(iframe, PAY_WITH_ETH_ERROR, {
                  error: errorObject,
                  suppressErrorToast,
                });
              },
            );
            return;
          }
        }
        await checkAndSendEth({
          data,
          iframe,
          payingWalletSigner,
          suppressErrorToast,
          onError,
          onPaymentSuccess,
        });
        break;
      }
      case "checkout-with-eth-sizing": {
        iframe.style.height = data.height + "px";
        iframe.style.maxHeight = data.height + "px";
        break;
      }
      case "onPriceUpdate": {
        onPriceUpdate?.(data as PriceSummary);
        break;
      }

      default:
        break;
    }
  };
}

export interface ICheckoutWithEthConfigs {
  contractId: string;
  walletAddress: string;
  email?: string;
  quantity?: number;
  mintMethod?: {
    name: string;
    args: Record<string, any>[];
    payment: { value: string; currency: string };
  };
  contractArgs?: Record<string, any>;

  // payment customizations
  capturePaymentLater?: boolean;
  fiatCurrency?: string;

  // stripe receipt
  title?: string;

  // email
  sendEmailOnTransferSucceeded?: boolean;
  postPurchaseMessageMarkdown?: string;
  postPurchaseButtonText?: string;
  successCallbackUrl?: string;
}

export interface CheckoutWithEthLinkArgs {
  sdkClientSecret?: string;
  appName?: string;
  payingWalletSigner: ethers.Signer;
  receivingWalletType?:
    | "WalletConnect"
    | "MetaMask"
    | "Coinbase Wallet"
    | string;
  showConnectWalletOptions?: boolean;

  locale?: Locale;
  options?: ICustomizationOptions;
  configs?: ICheckoutWithEthConfigs;
}

export async function createCheckoutWithEthLink({
  sdkClientSecret,
  payingWalletSigner,
  receivingWalletType,
  showConnectWalletOptions = false,
  appName,
  locale,
  options = {
    ...DEFAULT_BRAND_OPTIONS,
  },
  configs,
}: CheckoutWithEthLinkArgs) {
  const checkoutWithEthUrlBase = new URL(
    CHECKOUT_WITH_ETH_IFRAME_URL,
    PAPER_APP_URL,
  );
  const address = await payingWalletSigner.getAddress();
  let clientSecret = sdkClientSecret;
  if (!clientSecret && configs) {
    clientSecret = btoa(JSON.stringify(configs));
  }
  if (!clientSecret) {
    const error = `Must have either sdkClientSecret or configs field set. Received neither`;
    const destination = `/error?errorMessage=${error}`;
    const domain = getPaperOriginUrl();
    return new URL(destination, domain);
  }

  const checkoutWithEthLink = new LinksManager(checkoutWithEthUrlBase);
  checkoutWithEthLink.addClientSecret(clientSecret ?? "");
  checkoutWithEthLink.addRecipientWalletAddress(address);
  checkoutWithEthLink.addPayerWalletAddress(address);
  checkoutWithEthLink.addReceivingWalletType(receivingWalletType);
  checkoutWithEthLink.addAppName(appName);
  checkoutWithEthLink.addShowConnectWalletOptions(showConnectWalletOptions);
  checkoutWithEthLink.addStylingOptions(options);
  checkoutWithEthLink.addLocale(locale);

  return checkoutWithEthLink.getLink();
}

export type CheckoutWithEthElementArgs = Omit<
  Omit<CheckoutWithEthMessageHandlerArgs, "iframe">,
  "setUpUserPayingWalletSigner"
> &
  CheckoutWithEthLinkArgs &
  PaperPaymentElementConstructorArgs;

export async function createCheckoutWithEthElement({
  sdkClientSecret,
  suppressErrorToast,
  onError,
  onLoad,
  payingWalletSigner,
  receivingWalletType,
  appName,
  showConnectWalletOptions,
  locale,
  options,
  elementOrId,
  onPaymentSuccess: _onPaymentSuccess,
  onSuccess,
}: CheckoutWithEthElementArgs): Promise<HTMLIFrameElement> {
  const onPaymentSuccess =
    _onPaymentSuccess ??
    (onSuccess as CheckoutWithEthMessageHandlerArgs["onPaymentSuccess"]);
  const checkoutWithEthId = "checkout-with-eth-iframe";

  const checkoutWithEthMessageHandler = (iframe: HTMLIFrameElement) =>
    createCheckoutWithEthMessageHandler({
      iframe,
      onError,
      payingWalletSigner,
      suppressErrorToast,
      onPaymentSuccess,
    });

  const checkoutWithEthUrl = await createCheckoutWithEthLink({
    payingWalletSigner,
    sdkClientSecret,
    appName,
    locale,
    options,
    receivingWalletType,
    showConnectWalletOptions,
  });
  const paymentElement = new PaperPaymentElement({
    onLoad,
    elementOrId,
  });
  return paymentElement.createPaymentElement({
    handler: checkoutWithEthMessageHandler,
    iframeId: checkoutWithEthId,
    link: checkoutWithEthUrl,
  });
}
