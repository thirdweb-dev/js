import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { RabbyWallet, getInjectedRabbyProvider } from "@thirdweb-dev/wallets";
import { RabbyConnectUI } from "./RabbyConnectUI";

/**
 * @wallet
 */
export type RabbyWalletConfigOptions = {
  /**
   * When connecting Rabby using the QR Code - Wallet Connect connector is used which requires a project id.
   * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;

  /**
   * If true, the wallet will be tagged as "recommended" in ConnectWallet Modal
   */
  recommended?: boolean;
};

/**
 * A wallet configurator for [Rabby Wallet](https://rabby.io/) which allows integrating the wallet with React.
 *
 * It returns a `WalletConfig` object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or `useConnect` hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * rabbyWallet({
 *  projectId: 'YOUR_PROJECT_ID',
 *  recommended: true,
 * })
 * ```
 *
 * @param options -
 * Optional configuration options for the wallet
 *
 * ### projectId (optional)
 * When connecting Core using the QR Code - Wallet Connect connector is used which requires a project id.
 * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
 *
 * ### recommended (optional)
 * If true, the wallet will be tagged as "recommended" in [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal UI
 *
 * @wallet
 */
export const rabbyWallet = (
  options?: RabbyWalletConfigOptions,
): WalletConfig<RabbyWallet> => {
  return {
    id: RabbyWallet.id,
    recommended: options?.recommended,
    meta: {
      name: "Rabby Wallet",
      urls: {
        chrome:
          "https://chrome.google.com/webstore/detail/rabby-wallet/acmacodkjbdgmoleebolmdjonilkdbch",
      },
      iconURL:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IiM3QjdERkYiLz4KPG1hc2sgaWQ9Im1hc2swXzUzXzI0IiBzdHlsZT0ibWFzay10eXBlOmx1bWluYW5jZSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMTIiIHk9IjE2IiB3aWR0aD0iNTUiIGhlaWdodD0iNDkiPgo8cGF0aCBkPSJNNjcgMTZIMTJWNjQuODg4OUg2N1YxNloiIGZpbGw9IndoaXRlIi8+CjwvbWFzaz4KPGcgbWFzaz0idXJsKCNtYXNrMF81M18yNCkiPgo8cGF0aCBkPSJNNjUuNjQ3NSA0NC4zNDE1QzY3Ljc2NTQgMzkuMzE2NiA1Ny4yOTUxIDI1LjI3ODEgNDcuMjkyNCAxOS40MjkzQzQwLjk4NzQgMTQuODk4NCAzNC40MTc3IDE1LjUyMDggMzMuMDg3IDE3LjUxMDNDMzAuMTY3IDIxLjg3NjMgNDIuNzU2MyAyNS41NzU4IDUxLjE3NTkgMjkuODkyOUM0OS4zNjYxIDMwLjcyNzcgNDcuNjYwNSAzMi4yMjU5IDQ2LjY1NzUgMzQuMTQxOUM0My41MTg3IDMwLjUwMjQgMzYuNjI5MyAyNy4zNjg0IDI4LjU0NTIgMjkuODkyOUMyMy4wOTc2IDMxLjU5NDIgMTguNTcwMiAzNS42MDQ5IDE2LjgyMDQgNDEuNjYyNUMxNi4zOTUyIDQxLjQ2MTkgMTUuOTI0NSA0MS4zNTA0IDE1LjQyOTIgNDEuMzUwNEMxMy41MzUzIDQxLjM1MDQgMTIgNDIuOTgxIDEyIDQ0Ljk5MjNDMTIgNDcuMDAzOCAxMy41MzUzIDQ4LjYzNDMgMTUuNDI5MiA0OC42MzQzQzE1Ljc4MDIgNDguNjM0MyAxNi44Nzc4IDQ4LjM4NDMgMTYuODc3OCA0OC4zODQzTDM0LjQxNzcgNDguNTE5MkMyNy40MDMxIDYwLjMzNzUgMjEuODU5NiA2Mi4wNjUxIDIxLjg1OTYgNjQuMTEyNUMyMS44NTk2IDY2LjE2IDI3LjE2MzcgNjUuNjA1MSAyOS4xNTUzIDY0Ljg0MkMzOC42ODkyIDYxLjE4ODUgNDguOTI5MSA0OS44MDIyIDUwLjY4NjIgNDYuNTI0NUM1OC4wNjUyIDQ3LjUwMjIgNjQuMjY2NSA0Ny42MTc4IDY1LjY0NzUgNDQuMzQxNVoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl81M18yNCkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01MS4xNzQ1IDI5Ljg5MzVDNTEuNTY0NyAyOS43MzAzIDUxLjUwMyAyOS4xMTg3IDUxLjM5NTkgMjguNjM4QzUxLjE0OTUgMjcuNTMzMSA0Ni44OTk4IDIzLjA3NjMgNDIuOTA5MyAyMS4wODAxQzM3LjQ3MTcgMTguMzYwMyAzMy40Njc3IDE4LjUwMDMgMzIuODc1NyAxOS43NTM3QzMzLjk4MzEgMjIuMTY0OCAzOS4xMTg0IDI0LjQyODYgNDQuNDgxOCAyNi43OTI5QzQ2Ljc3IDI3LjgwMTYgNDkuMDk4NCAyOC44MjkgNTEuMTc0NSAyOS44OTM1WiIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzUzXzI0KSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTQ0LjI3NCA1NC4xNTk2QzQzLjE3NDMgNTMuNzEzMiA0MS45MzIxIDUzLjMwMzggNDAuNTE5OCA1Mi45MzIyQzQyLjAyNTYgNTAuMDcwNSA0Mi4zNDE1IDQ1LjgzNCA0MC45MTk1IDQzLjE1NTVDMzguOTIzNCAzOS4zOTY0IDM2LjQxOCAzNy4zOTU2IDMwLjU5NiAzNy4zOTU2QzI3LjM5MzcgMzcuMzk1NiAxOC43NzIyIDM4LjU0MTIgMTguNjE5MSA0Ni4xODQ4QzE4LjYwMzEgNDYuOTg2NyAxOC42MTg3IDQ3LjcyMTcgMTguNjczNCA0OC4zOTc2TDM0LjQxNzEgNDguNTE4OEMzMi4yOTQ1IDUyLjA5NDggMzAuMzA2NyA1NC43NDcxIDI4LjU2NjUgNTYuNzYzN0MzMC42NTYgNTcuMzMyNCAzMi4zODAzIDU3LjgwOTYgMzMuOTYzMyA1OC4yNDhDMzUuNDY1MyA1OC42NjM4IDM2Ljg0MDMgNTkuMDQ0NSAzOC4yNzkyIDU5LjQzNDRDNDAuNDUgNTcuNzU0OCA0Mi40OTA2IDU1LjkyMzMgNDQuMjc0IDU0LjE1OTZaIiBmaWxsPSJ1cmwoI3BhaW50Ml9saW5lYXJfNTNfMjQpIi8+CjxwYXRoIGQ9Ik0xNi42MTA0IDQ3LjYxMjZDMTcuMjUzNiA1My40MTkxIDIwLjM2MDcgNTUuNjk0NyAyNi43MSA1Ni4zNjgyQzMzLjA1OTMgNTcuMDQxNiAzNi43MDEyIDU2LjU4OTkgNDEuNTQ5OSA1Ny4wNTgzQzQ1LjU5OTYgNTcuNDQ5NyA0OS4yMTU1IDU5LjY0MTMgNTAuNTU2OSA1OC44ODRDNTEuNzY0MiA1OC4yMDIzIDUxLjA4ODcgNTUuNzM5NiA0OS40NzMzIDU0LjE1OThDNDcuMzc5NSA1Mi4xMTE2IDQ0LjQ4MTQgNTAuNjg3NyAzOS4zODIxIDUwLjE4MjVDNDAuMzk4NCA0Ny4yMjc1IDQwLjExMzYgNDMuMDg0MSAzOC41MzUzIDQwLjgyOTlDMzYuMjUzMyAzNy41NzA0IDMyLjA0MSAzNi4wOTY4IDI2LjcxIDM2Ljc0MDdDMjEuMTQwMiAzNy40MTMzIDE1LjgwMzIgNDAuMzI1NiAxNi42MTA0IDQ3LjYxMjZaIiBmaWxsPSJ1cmwoI3BhaW50M19saW5lYXJfNTNfMjQpIi8+CjwvZz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl81M18yNCIgeDE9IjI3LjkxMDkiIHkxPSIzOS44OTE4IiB4Mj0iNjUuNTA4OSIgeTI9IjQ5LjkzMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSJ3aGl0ZSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IndoaXRlIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl81M18yNCIgeDE9IjU4LjkxMzIiIHkxPSIzOS4xMzkxIiB4Mj0iMzAuMzkyMiIgeTI9IjEyLjIxODgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzg2OTdGRiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Njk3RkYiIHN0b3Atb3BhY2l0eT0iMCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50Ml9saW5lYXJfNTNfMjQiIHgxPSI0NS4wMjIzIiB5MT0iNTUuMTU3MSIgeDI9IjE4LjQzMzIiIHkyPSI0MC43NjMzIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM4Njk3RkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjODY5N0ZGIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDNfbGluZWFyXzUzXzI0IiB4MT0iMzAuMTM2NiIgeTE9IjM5LjU5NjQiIHgyPSI0OC45MTgxIiB5Mj0iNjIuMDY2IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IndoaXRlIi8+CjxzdG9wIG9mZnNldD0iMC45ODM4OTUiIHN0b3AtY29sb3I9IiNEMUQ4RkYiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K",
    },
    create: (walletOptions: WalletOptions) => {
      const wallet = new RabbyWallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: false,
      });

      return wallet;
    },
    connectUI: RabbyConnectUI,
    isInstalled() {
      return !!getInjectedRabbyProvider();
    },
  };
};
