import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import { SmartWallet, createAsyncLocalStorage } from "@thirdweb-dev/wallets";
import { SmartWalletConfig } from "../types/smart-wallet";
import { SmartWalletFlow } from "../../components/ConnectWalletFlow/SmartWallet/SmartWalletFlow";

/**
 * Wallet config for Smart Wallet.
 *
 * @param wallet - The EOA wallet config to be connected to the SmartWallet
 * @param config - The config for SmartWallet
 * @returns The wallet config to be used by the ThirdwebProvider
 *
 * @example
 * ```jsx
 * import { ThirdwebProvider, smartWallet, metamaskWallet } from "@thirdweb-dev/react-native";
 *
 * <ThirdwebProvider
 *    supportedWallets={[
 *       smartWallet(metamaskWallet(), {
 *          factoryAddress: 'factory-address',
 *          gasless: true,
 *       }),
 *    ]}>
 *   <YourApp />
 * </ThirdwebProvider>
 * ```
 */
export const smartWallet = (
  wallet: WalletConfig<any>,
  config: SmartWalletConfig,
): WalletConfig<SmartWallet> => {
  const WalletSelectUI = wallet.selectUI;

  return {
    ...wallet,
    create: (options: WalletOptions) =>
      new SmartWallet({
        ...options,
        ...config,
        walletStorage: createAsyncLocalStorage("smart-wallet"),
      }),
    connectUI(props) {
      return <SmartWalletFlow {...props} personalWalletConfig={wallet} />;
    },
    selectUI: WalletSelectUI
      ? (props) => {
          return <WalletSelectUI {...props} walletConfig={wallet} />;
        }
      : undefined,
    personalWallets: [wallet],
  };
};
