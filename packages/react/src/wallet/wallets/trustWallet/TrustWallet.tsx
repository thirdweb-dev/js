import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { TrustWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";
import { TrustConnectUI } from "./TrustConnectUI";

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
    meta: TrustWallet.meta,
    create: (walletOptions: WalletOptions) => {
      return new TrustWallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: false,
      });
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
