import { Theme } from "../../design-system";

export function openGoogleSignInWindow(themeObj: Theme) {
  // open the popup in the center of the screen
  const width = 350;
  const height = 500;
  const top = (window.innerHeight - height) / 2;
  const left = (window.innerWidth - width) / 2;

  const win = window.open(
    "",
    undefined,
    `width=${width}, height=${height}, top=${top}, left=${left}`,
  );
  if (win) {
    win.document.title = "Sign In - Google Accounts";
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
    width: 15vw;
    height: 15vw;
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
