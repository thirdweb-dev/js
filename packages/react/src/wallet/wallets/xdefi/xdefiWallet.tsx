import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { XDEFIWallet } from "@thirdweb-dev/wallets";
import { XDefiConnectUI } from "./XdefiConnectUI";
import { getInjectedXDEFIProvider } from "@thirdweb-dev/wallets";

/**
 * @wallet
 */
export type XdefiWalletConfigOptions = {
  /**
   * If `true`, the wallet will be tagged as "recommended" in ConnectWallet Modal. Default is `false`
   */
  recommended?: boolean;
};

/**
 * A wallet configurator for [XDEFI Wallet](https://www.xdefi.io/) which allows integrating the wallet with React.
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * xdefiWallet({
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
export const xdefiWallet = (
  options?: XdefiWalletConfigOptions,
): WalletConfig<XDEFIWallet> => {
  return {
    recommended: options?.recommended,
    id: "XDEFI",
    meta: {
      name: "XDEFI Wallet",
      urls: {
        chrome:
          "https://chromewebstore.google.com/detail/xdefi-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf",
      },
      iconURL:
        "data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='80' height='80' rx='12' fill='%23335DE5'/%3E%3Cpath d='M44.3735 42.8737C40.1971 45.4756 34.607 46.8157 28.9456 46.5293C24.1856 46.2952 20.2816 44.5779 17.9211 41.7548C15.8459 39.231 15.0418 35.9006 15.5865 32.0692C15.7711 30.7959 16.1495 29.5586 16.7084 28.4005L16.7862 28.2379C18.7456 24.4541 21.6534 21.2473 25.2235 18.933C28.7936 16.6188 32.9031 15.2768 37.1472 15.0392C41.3913 14.8017 45.624 15.6767 49.4287 17.5781C53.2333 19.4796 56.4788 22.3419 58.8457 25.8835C61.2128 29.4252 62.6196 33.5239 62.9277 37.7764C63.2359 42.029 62.4348 46.2887 60.6035 50.1363C58.772 53.9841 55.9733 57.2872 52.4827 59.7206C48.9923 62.154 44.9302 63.6337 40.6964 64.0144L40.9557 67C45.7093 66.5753 50.2705 64.9158 54.1899 62.1849C58.1096 59.4542 61.2523 55.7461 63.3084 51.4264C65.3647 47.1067 66.2635 42.3241 65.9163 37.5499C65.5691 32.7757 63.988 28.1746 61.3286 24.1998C58.6694 20.225 55.0235 17.0137 50.7504 14.8823C46.4772 12.7508 41.7242 11.7728 36.9596 12.0444C32.1951 12.3161 27.5832 13.8281 23.5784 16.4315C19.5736 19.0349 16.3141 22.64 14.1209 26.8914L14.0171 27.1061C13.3238 28.5432 12.8557 30.079 12.6293 31.6594C11.9808 36.3299 12.986 40.4864 15.6124 43.6869C18.4853 47.1864 23.161 49.268 28.7705 49.5411C35.5993 49.8859 42.389 48.019 47.2074 44.5844L44.3735 42.8737Z' fill='white'/%3E%3Cpath d='M50.0863 46.2693C47.3691 48.637 41.0527 52.9301 30.573 53.5155C18.8417 54.1661 13.952 50.3412 13.9066 50.3022L12.9598 51.4731L13.9131 50.3218L12 52.6244C12.2075 52.8 16.8962 56.5988 27.9077 56.5988C28.8091 56.5988 29.7559 56.5988 30.7416 56.5208C43.4069 55.8118 50.3652 50.2697 52.7906 47.9019L50.0863 46.2693Z' fill='white'/%3E%3Cpath d='M55.1712 49.366C53.5646 51.4845 51.5868 53.2919 49.3347 54.6999C41.397 59.8388 31.2999 60.5023 24.2313 60.1444L24.0822 63.1431C25.2689 63.2017 26.4103 63.2277 27.5192 63.2277C47.4541 63.2277 55.5085 54.1211 57.7588 50.8687L55.1647 49.34' fill='white'/%3E%3Cpath d='M54.4124 38.0117C55.7338 38.0117 56.805 36.9372 56.805 35.6117C56.805 34.2862 55.7338 33.2116 54.4124 33.2116C53.0908 33.2116 52.0195 34.2862 52.0195 35.6117C52.0195 36.9372 53.0908 38.0117 54.4124 38.0117Z' fill='white'/%3E%3C/svg%3E%0A",
    },
    create: (walletOptions: WalletOptions) => new XDEFIWallet(walletOptions),
    connectUI: XDefiConnectUI,
    isInstalled() {
      return !!getInjectedXDEFIProvider();
    },
  };
};
