import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { BinanceWallet } from "@thirdweb-dev/wallets";
import { BinanceConnectUI } from "./BinanceConnectUI";
import { getInjectedBinanceProvider } from "@thirdweb-dev/wallets";

/**
 * @wallet
 */
export type BinanceWalletConfigOptions = {
  /**
   * If `true`, the wallet will be tagged as "recommended" in ConnectWallet Modal. Default is `false`
   */
  recommended?: boolean;
};

/**
 * A wallet configurator for [Phantom Wallet](https://phantom.app/) which allows integrating the wallet with React.
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * phantomWallet({
 *  recommended: true,
 * })
 * ```
 *
 * @param options -
 * Optional configuration options for the wallet
 *
 * ### recommended (optional)
 * If `true`, the wallet will be tagged as "recommended" in [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal UI. Default is `false`
 *
 * @wallet
 */
export const binanceWallet = (
  options?: BinanceWalletConfigOptions,
): WalletConfig<BinanceWallet> => {
  return {
    recommended: options?.recommended,
    id: "Binance",
    meta: {
      name: "Binance Wallet",
      urls: {
        android: "",
        ios: "",
      },
      iconURL: "",
    },
    create: (walletOptions: WalletOptions) => new BinanceWallet(walletOptions),
    connectUI: BinanceConnectUI,
    isInstalled() {
      return !!getInjectedBinanceProvider();
    },
  };
};
