import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { ZerionWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";
import { ZerionConnectUI } from "./ZerionConnectUI";
import { isMobile } from "../../../evm/utils/isMobile";
import { openWindow } from "../../utils/openWindow";

type ZerionkWalletOptions = {
  /**
   * When connecting MetaMask using the QR Code - Wallet Connect connector is used which requires a project id.
   * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;
};

export const zerionWallet = (
  options?: ZerionkWalletOptions,
): WalletConfig<ZerionWallet> => {
  return {
    id: ZerionWallet.id,
    meta: ZerionWallet.meta,
    create: (walletOptions: WalletOptions) => {
      const wallet = new ZerionWallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: false,
      });

      if (isMobile()) {
        wallet.on("wc_session_request_sent", () => {
          openWindow(`zerion://wc?uri=""`);
        });
      }

      return wallet;
    },
    connectUI: ZerionConnectUI,
    isInstalled() {
      if (assertWindowEthereum(globalThis.window)) {
        return !!globalThis.window.ethereum.isZerion;
      }
      return false;
    },
  };
};
