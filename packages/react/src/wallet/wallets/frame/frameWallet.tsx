import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import {
  FrameWallet,
  assertWindowEthereum,
  createAsyncLocalStorage,
  walletIds,
} from "@thirdweb-dev/wallets";
import { FrameConnectUI } from "./FrameConnectUI";

export const frameWallet = (): WalletConfig<FrameWallet> => ({
  id: FrameWallet.id,
  meta: {
    name: "Frame",
    iconURL:
      "https://frame.nyc3.digitaloceanspaces.com/bundle/home/favicon.8f0e1342.png",
    urls: {
      chrome:
        "https://chrome.google.com/webstore/detail/frame-companion/ldcoohedfbjoobcadoglnnmmfbdlmmhf",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/frame-extension",
    },
  },
  create(options: WalletOptions) {
    return new FrameWallet(options);
  },
  connectUI: FrameConnectUI,
  isInstalled() {
    if (assertWindowEthereum(globalThis.window)) {
      return (
        globalThis.window.ethereum?.isFrame ||
        globalThis.window.ethereum?.providers?.some((p) => p.isFrame) ||
        false
      );
    }
    return false;
  },
});
