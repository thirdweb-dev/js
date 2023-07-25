import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { WalletConnect } from "@thirdweb-dev/wallets";
import { RainbowConnectUI } from "./RainbowConnectUI";
import { rainbowWalletUris } from "./rainbowWalletUris";
import { handelWCSessionRequest } from "../handleWCSessionRequest";

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
      urls: {
        android: "https://rnbwapp.com/e/Va41HWS6Oxb",
        ios: "https://rnbwapp.com/e/OeMdmkJ6Oxb",
      },
    },
    create: (walletOptions: WalletOptions) => {
      const wallet = new WalletConnect({
        ...walletOptions,
        walletId: "rainbow",
        projectId: options?.projectId,
        qrcode: false,
      });

      handelWCSessionRequest(wallet, rainbowWalletUris);

      return wallet;
    },
    connectUI: RainbowConnectUI,
    isInstalled() {
      return false;
    },
  };
};
