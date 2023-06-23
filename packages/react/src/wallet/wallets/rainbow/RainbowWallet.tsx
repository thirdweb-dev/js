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
        "ipfs://QmSZn47p4DVVBfzvg9BAX2EqwnPxkT1YAE7rUnrtd9CybQ/rainbow-logo.png",
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
