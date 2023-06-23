import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { WalletConnect } from "@thirdweb-dev/wallets";
import { RainbowConnectUI } from "./RainbowConnectUI";

type RainbowWalletOptions = {
  /**
   * When connecting Rainbow using the QR Code - Wallet Connect connector is used which requires a project id.
   * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;
};

export const rainbowWallet = (
  options?: RainbowWalletOptions,
): WalletConfig<WalletConnect> => {
  return {
    id: "rainbow",
    meta: {
      name: "Rainbow Wallet",
      iconURL:
        "https://registry.walletconnect.org/v2/logo/md/7a33d7f1-3d12-4b5c-f3ee-5cd83cb1b500",
    },
    create: (walletOptions: WalletOptions) => {
      return new WalletConnect({
        ...walletOptions,
        walletId: "rainbow",
        projectId: options?.projectId,
        qrcode: false,
      });
    },
    connectUI: RainbowConnectUI,
    isInstalled() {
      return false;
    },
  };
};
