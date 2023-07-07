import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { MetaMaskWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";
import { MetamaskConnectUI } from "./MetamaskConnectUI";
import { isMobile } from "../../../evm/utils/isMobile";
import { openWindow } from "../../utils/openWindow";

type MetamaskWalletOptions = {
  /**
   * When connecting MetaMask using the QR Code - Wallet Connect connector is used which requires a project id.
   * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;
};

export const metamaskWallet = (
  options?: MetamaskWalletOptions,
): WalletConfig<MetaMaskWallet> => {
  return {
    id: MetaMaskWallet.id,
    meta: MetaMaskWallet.meta,
    create: (walletOptions: WalletOptions) => {
      const wallet = new MetaMaskWallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: false,
      });

      if (isMobile()) {
        wallet.on("wc_session_request_sent", () => {
          openWindow(`metamask://wc?uri=""`);
        });
      }

      return wallet;
    },
    connectUI: MetamaskConnectUI,
    isInstalled() {
      if (assertWindowEthereum(globalThis.window)) {
        return globalThis.window.ethereum.isMetaMask;
      }
      return false;
    },
  };
};
