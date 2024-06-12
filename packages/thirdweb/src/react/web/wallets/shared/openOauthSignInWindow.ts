import type { InAppWalletSocialAuth } from "../../../../wallets/in-app/core/wallet/types.js";
import type { Theme } from "../../../core/design-system/index.js";

function getBodyTitle(authOption: InAppWalletSocialAuth) {
  switch (authOption) {
    case "google":
      return "Sign In - Google Accounts";
    default:
      return `Sign In - ${authOption
        .slice(0, 1)
        .toUpperCase()}${authOption.slice(1)}`;
  }
}

function getWidthAndHeight(authOption: InAppWalletSocialAuth) {
  switch (authOption) {
    case "facebook":
      return { width: 715, height: 555 };
    default:
      return { width: 350, height: 500 };
  }
}

/**
 *
 * @internal
 */
export function openOauthSignInWindow(
  authOption: InAppWalletSocialAuth,
  themeObj: Theme,
) {
  // open the popup in the center of the screen
  const { height, width } = getWidthAndHeight(authOption);
  const top = (window.innerHeight - height) / 2;
  const left = (window.innerWidth - width) / 2;

  const win = window.open(
    "",
    undefined,
    `width=${width}, height=${height}, top=${top}, left=${left}`,
  );
  if (win) {
    const title = getBodyTitle(authOption);
    win.document.title = title;
    win.document.body.innerHTML = spinnerWindowHtml;
    win.document.body.style.background = themeObj.colors.modalBg;
    win.document.body.style.color = themeObj.colors.accentText;
  }

  // close it when current window is closed or refreshed
  if (win) {
    window.addEventListener("beforeunload", () => {
      win?.close();
    });
  }

  return win;
}

const spinnerWindowHtml = `
<svg class="loader" viewBox="0 0 50 50">
  <circle
    cx="25"
    cy="25"
    r="20"
    fill="none"
    stroke="currentColor"
    stroke-width="4"
  />
</svg>

<style>
  body,
  html {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loader {
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
  }

  .loader circle {
    animation: loading 1.5s linear infinite;
  }

  @keyframes loading {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
`;
