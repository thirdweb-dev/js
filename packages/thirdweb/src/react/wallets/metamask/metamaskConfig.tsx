import {
  injectedProvider,
  metamaskMetadata,
  metamaskWallet,
} from "../../../wallets/index.js";
import type { WalletConfig } from "../../types/wallets.js";
import { InjectedConnectUI } from "../shared/InjectedConnectUI.js";

/**
 * TODO
 * @example TODO
 * @returns TODO
 */
export const metamaskConfig = (): WalletConfig => {
  return {
    connect: metamaskWallet,
    metadata: metamaskMetadata,
    connectUI(props) {
      return (
        <InjectedConnectUI
          {...props}
          links={{
            chromeExtension:
              "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
            googlePlayStore:
              "https://play.google.com/store/apps/details?id=io.metamask",
            appleStore:
              "https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202",
          }}
        />
      );
    },
    isInstalled() {
      return !!injectedProvider("io.metamask");
    },
  };
};
