import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { TrustWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";
import { TrustConnectUI } from "./TrustConnectUI";
import { trustWalletUris } from "./trustWalletUris";
import { handelWCSessionRequest } from "../handleWCSessionRequest";

type TrustWalletOptions = {
  /**
   * When connecting Trust using the QR Code - Wallet Connect connector is used which requires a project id.
   * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;
};

export const trustWallet = (
  options?: TrustWalletOptions,
): WalletConfig<TrustWallet> => {
  return {
    id: TrustWallet.id,
    meta: {
      ...TrustWallet.meta,
      name: "Trust",
      iconURL:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IiMzMzc1QkIiLz4KPHBhdGggZD0iTTQwLjUzMDMgMTcuMTQyNUM0OC4yNDc3IDIzLjY4NTcgNTcuMTU2IDIzLjM1MTggNTkuNzAwMyAyMy4zNzA3QzU4Ljg2OTggNjAuMjUxMyA1NC42ODM1IDUyLjkwNTggNDAuMTg4NyA2My4xNDEyQzI1Ljg0NzQgNTIuNjkxNiAyMS41NzkgNTkuOTc0NCAyMS4yOTY0IDIzLjA4NTVDMjMuODE0MiAyMy4xMDQyIDMyLjcxNjUgMjMuNTcwNCA0MC41MzAzIDE3LjE0MjVaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjciIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=",
    },
    create: (walletOptions: WalletOptions) => {
      const wallet = new TrustWallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: false,
      });

      handelWCSessionRequest(wallet, trustWalletUris);

      return wallet;
    },
    connectUI: TrustConnectUI,
    isInstalled() {
      if (assertWindowEthereum(globalThis.window)) {
        return !!globalThis.window.ethereum.isTrust;
      }
      return false;
    },
  };
};
