import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { OneKeyWallet, getInjectedOneKeyProvider } from "@thirdweb-dev/wallets";
import { OneKeyConnectUI } from "./OneKeyConnectUI";

export type OneKeyWalletConfigOptions = {
  /**
   * When connecting OneKey wallet using the QR Code - Wallet Connect connector is used which requires a project id.
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

export const oneKeyWallet = (
  options?: OneKeyWalletConfigOptions,
): WalletConfig<OneKeyWallet> => {
  return {
    id: OneKeyWallet.id,
    recommended: options?.recommended,
    meta: {
      name: "OneKey Wallet",
      urls: {
        chrome:
          "https://chrome.google.com/webstore/detail/onekey/jnmbobjmhlngoefaiojfljckilhhlhcj",
        android:
          "https://play.google.com/store/apps/details?id=so.onekey.app.wallet",
        ios: "https://apps.apple.com/us/app/onekey-blockchain-defi-wallet/id1609559473",
      },
      iconURL:
        "data:image/png;base64,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",
    },
    create: (walletOptions: WalletOptions) => {
      const wallet = new OneKeyWallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: false,
      });

      return wallet;
    },
    connectUI: OneKeyConnectUI,
    isInstalled() {
      return !!getInjectedOneKeyProvider();
    },
  };
};
