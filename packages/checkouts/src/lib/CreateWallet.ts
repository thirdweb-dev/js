import type {
  Locale,
  SupportedChainName,
} from "@paperxyz/sdk-common-utilities";
import { CREATE_WALLET_IFRAME_URL, PAPER_APP_URL } from "../constants/settings";
import type { PaperSDKError } from "../interfaces/PaperSDKError";
import { PaperSDKErrorCode } from "../interfaces/PaperSDKError";
import type { PaperUser } from "../interfaces/PaperUser";
import { LinksManager } from "../utils/LinksManager";
import { postMessageToIframe } from "../utils/postMessageToIframe";

// eslint-disable-next-line @typescript-eslint/no-var-requires, better-tree-shaking/no-top-level-side-effects
const packageJson = require("../../package.json");

const showMagicIframe = () => {
  const iframe = document.getElementById(CREATE_WALLET_IFRAME_ID);

  if (iframe) {
    const size = 400;
    document.body.style.overflow = "hidden";
    iframe.setAttribute(
      "style",
      `
    position: fixed;
    left: calc(50% - ${size / 2}px);
    top: calc(50% - ${size / 2}px);
    width: ${size}px;
    height: ${size}px;
    z-index: 99999;
    border-radius: 28px;
    border: none;
  `,
    );
  }
};

const idleIframeStyle = `
  width: 0;
  height: 0;
  visibility: hidden;
`;

const hideMagicIframe = () => {
  const iframe = document.getElementById(CREATE_WALLET_IFRAME_ID);

  if (iframe) {
    document.body.style.overflow = "visible";
    iframe.setAttribute("style", idleIframeStyle);
  }
};

export function createWalletLink({ locale }: { locale?: Locale }) {
  const iframeUrlBase = new URL(CREATE_WALLET_IFRAME_URL, PAPER_APP_URL);
  const iframeUrl = new LinksManager(iframeUrlBase);
  iframeUrl.addLocale(locale);
  iframeUrl.addOTP();

  return iframeUrl.getLink();
}

function createWalletMessageHandler({
  onSuccess,
  onEmailVerificationInitiated,
  onError,
}: {
  onSuccess: (user: PaperUser) => void;
  onEmailVerificationInitiated?: () => void;
  onError?: (error: PaperSDKError) => void;
}) {
  return (event: MessageEvent) => {
    if (event.origin !== PAPER_APP_URL){ return;}

    const data = event.data;
    switch (data.eventType) {
      case "verifyEmailEmailVerificationInitiated": {
        if (onEmailVerificationInitiated) {
          onEmailVerificationInitiated();
        }
        showMagicIframe();
        break;
      }
      case "verifyEmailError": {
        console.error("Error in Paper SDK VerifyEmail", data.error);
        if (onError) {
          onError({
            code: PaperSDKErrorCode.EmailNotVerified,
            error: data.error,
          });
        }
        hideMagicIframe();
        break;
      }
      case "verifyEmailSuccess": {
        onSuccess({
          emailAddress: data.emailAddress,
          walletAddress: data.walletAddress,
          accessCode: data.accessCode,
        });
        hideMagicIframe();
      }
    }
  };
}

const CREATE_WALLET_IFRAME_ID = "paper-create-wallet-iframe";
export async function initialiseCreateWallet({
  onSuccess,
  locale,
  onEmailVerificationInitiated,
  onError,
}: {
  onSuccess: (user: PaperUser) => void;
  onEmailVerificationInitiated?: () => void;
  onError?: (error: PaperSDKError) => void;
  locale?: Locale;
}) {
  let iframe = document.getElementById(
    CREATE_WALLET_IFRAME_ID,
  ) as HTMLIFrameElement | null;

  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.src = createWalletLink({ locale }).href;
    iframe.setAttribute("style", idleIframeStyle);
    iframe.setAttribute("id", CREATE_WALLET_IFRAME_ID);
    iframe.setAttribute(
      "data-paper-sdk-version",
      `@paperxyz/js-client-sdk@${packageJson.version}`,
    );
    document.body.appendChild(iframe);

    const messageHandler = createWalletMessageHandler({
      onSuccess,
      onEmailVerificationInitiated,
      onError,
    });
    window.addEventListener("message", messageHandler);
  }
}

export async function createWallet({
  chainName,
  emailAddress,
  clientId,
  redirectUrl,
}: {
  emailAddress: string;
  chainName: SupportedChainName;
  redirectUrl?: string;
  clientId?: string;
}) {
  const iframe = document.getElementById(
    CREATE_WALLET_IFRAME_ID,
  ) as HTMLIFrameElement | null;

if (!iframe) {
    throw new Error(
      'Error: You likely forgot to call "initialiseCreateWallet" on your component mount before calling "createWallet"',
    );
  }

  postMessageToIframe(iframe, "verifyEmail", {
    email: emailAddress,
    chainName,
    redirectUrl,
    clientId,
  });
}
