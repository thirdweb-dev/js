import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { Coin98Wallet, getInjectedCoin98Provider } from "@thirdweb-dev/wallets";
import { Coin98ConnectUI } from "./Coin98ConnectUI";

type Coin98WalletOptions = {
  /**
   * When connecting Coin98 using the QR Code - Wallet Connect connector is used which requires a project id.
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

export const coin98Wallet = (
  options?: Coin98WalletOptions,
): WalletConfig<Coin98Wallet> => {
  return {
    id: Coin98Wallet.id,
    recommended: options?.recommended,
    meta: {
      name: "Coin98 Wallet",
      urls: {
        chrome:
          "https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg",
        android:
          "https://play.google.com/store/apps/details?id=coin98.crypto.finance.media",
        ios: "https://apps.apple.com/us/app/coin98-super-wallet/id1561969966",
      },
      iconURL:
        "data:image/png;base64,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",
    },
    create: (walletOptions: WalletOptions) => {
      const wallet = new Coin98Wallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: false,
      });

      return wallet;
    },
    connectUI: Coin98ConnectUI,
    isInstalled() {
      return !!getInjectedCoin98Provider();
    },
  };
};
