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

  /**
   * If true, the wallet will be tagged as "reccomended" in ConnectWallet Modal
   */
  recommended?: boolean;
};

export const trustWallet = (
  options?: TrustWalletOptions,
): WalletConfig<TrustWallet> => {
  return {
    id: TrustWallet.id,
    recommended: options?.recommended,
    meta: {
      ...TrustWallet.meta,
      iconURL:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik00MC41MzAzIDE3LjE0MjVDNDguMjQ3NyAyMy42ODU3IDU3LjE1NiAyMy4zNTE4IDU5LjcwMDMgMjMuMzcwN0M1OC44Njk4IDYwLjI1MTMgNTQuNjgzNSA1Mi45MDU4IDQwLjE4ODcgNjMuMTQxMkMyNS44NDc0IDUyLjY5MTYgMjEuNTc5IDU5Ljk3NDQgMjEuMjk2NCAyMy4wODU1QzIzLjgxNDIgMjMuMTA0MiAzMi43MTY1IDIzLjU3MDQgNDAuNTMwMyAxNy4xNDI1WiIgc3Ryb2tlPSIjMzM3NUJCIiBzdHJva2Utd2lkdGg9IjciIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=",
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
