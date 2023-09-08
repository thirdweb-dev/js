import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import { FrameWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";
import { FrameConnectUI } from "./FrameConnectUI";

type FrameConfig = {
  /**
   * If true, the wallet will be tagged as "reccomended" in ConnectWallet Modal
   */
  recommended?: boolean;
};

export const frameWallet = (
  config?: FrameConfig,
): WalletConfig<FrameWallet> => ({
  id: FrameWallet.id,
  recommended: config?.recommended,
  meta: {
    name: "Frame",
    iconURL: "ipfs://QmW8sXz6e6hbwJdiPvqX64rVy4uQ7SkW2MYUxR1fJXRFpT/frame.png",
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
    const window_: Window | undefined = globalThis?.window;
    if (assertWindowEthereum(window_)) {
      return (
        window_.ethereum?.isFrame ||
        window_.ethereum?.providers?.some((p) => p.isFrame) ||
        false
      );
    }
    return false;
  },
});
