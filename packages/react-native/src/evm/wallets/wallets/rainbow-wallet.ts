import {
  WalletOptions as WalletOptionsRC,
  WalletConfig,
} from "@thirdweb-dev/react-core";
import { WalletConnectBase } from "./wallet-connect/WalletConnectBase";
import { WalletConnectConfig } from "./wallet-connect/wallet-connect";
import { RAINBOW_ICON } from "../../assets/svgs";

export class RainbowWallet extends WalletConnectBase {
  static id = "rainbow" as const;
  static meta = {
    name: "Rainbow",
    iconURL: RAINBOW_ICON,
    links: {
      native: "rainbow:",
      universal: "https://rnbwapp.com",
    },
  };

  getMeta() {
    return RainbowWallet.meta;
  }
}

/**
 * Wallet config for Rainbow Wallet.
 *
 * @param config - The config for RainbowWallet
 * @returns The wallet config to be used by the ThirdwebProvider
 *
 * @example
 * ```jsx
 * import { ThirdwebProvider, rainbowWallet } from "@thirdweb-dev/react-native";
 *
 * <ThirdwebProvider
 *    supportedWallets={[rainbowWallet()]}>
 *   <YourApp />
 * </ThirdwebProvider>
 * ```
 */
export const rainbowWallet = (config?: WalletConnectConfig) => {
  return {
    id: RainbowWallet.id,
    meta: RainbowWallet.meta,
    create: (options: WalletOptionsRC) =>
      new RainbowWallet({
        ...options,
        walletId: RainbowWallet.id,
        projectId: config?.projectId,
      }),
    recommended: config?.recommended,
  } satisfies WalletConfig;
};
