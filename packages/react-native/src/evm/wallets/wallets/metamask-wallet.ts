import { walletIds } from "@thirdweb-dev/wallets";
import { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { WCMeta } from "../types/wc";
import { WalletConnectBase } from "./wallet-connect/WalletConnectBase";
import { WalletConnectConfig } from "./wallet-connect/wallet-connect";
import { METAMASK_ICON } from "../../assets/svgs";

export class MetaMaskWallet extends WalletConnectBase {
  static id = walletIds.metamask;
  static meta = {
    name: "MetaMask",
    iconURL: METAMASK_ICON,
    links: {
      native: "metamask:",
      universal: "https://metamask.app.link",
    },
  };

  getMeta(): WCMeta {
    return MetaMaskWallet.meta;
  }
}

/**
 * Wallet config for MetaMask Wallet.
 *
 * @param config - The config for MetamaskWallet
 * @returns The wallet config to be used by the ThirdwebProvider
 *
 * @example
 * ```jsx
 * import { ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react-native";
 *
 * <ThirdwebProvider
 *    supportedWallets={[metamaskWallet()]}>
 *   <YourApp />
 * </ThirdwebProvider>
 * ```
 */
export const metamaskWallet = (config?: WalletConnectConfig) => {
  return {
    id: MetaMaskWallet.id,
    meta: MetaMaskWallet.meta,
    create: (options: WalletOptions) =>
      new MetaMaskWallet({
        ...options,
        walletId: walletIds.metamask,
        projectId: config?.projectId,
      }),
    recommended: config?.recommended,
  } satisfies WalletConfig;
};
