import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import {
  RainbowWallet,
  getInjectedRainbowProvider,
} from "@thirdweb-dev/wallets";
import { RainbowConnectUI } from "./RainbowConnectUI";
import { handelWCSessionRequest } from "../handleWCSessionRequest";
import { rainbowWalletUris } from "./rainbowWalletUris";

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
): WalletConfig<RainbowWallet> => {
  return {
    id: RainbowWallet.id,
    meta: RainbowWallet.meta,
    create: (walletOptions: WalletOptions) => {
      const wallet = new RainbowWallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: false,
      });

      handelWCSessionRequest(wallet, rainbowWalletUris);

      return wallet;
    },
    connectUI: RainbowConnectUI,
    isInstalled() {
      return !!getInjectedRainbowProvider();
    },
  };
};
