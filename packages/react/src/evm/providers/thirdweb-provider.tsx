import { createAsyncLocalStorage } from "../../core/WalletStorage";
import { ThirdwebProvider as ThirdwebProviderCore } from "@thirdweb-dev/react-core";
import { ComponentProps } from "react";

interface ThirdwebProviderProps
  extends Omit<
    ComponentProps<typeof ThirdwebProviderCore>,
    "createWalletStorage"
  > {
  /**
   * Wallets that will be supported by the dApp
   * @defaultValue [MetaMaskWallet, CoinbaseWallet, DeviceWallet]
   *
   * @example
   * ```jsx
   * import { MetamaskWallet, CoinbaseWallet, DeviceWallet } from "@thirdweb-dev/react";
   *
   * <ThirdwebProvider
   *  supportedWallets={[MetaMaskWallet, CoinbaseWallet, DeviceWallet]}
   * />
   * ```
   */
  supportedWallets?: ComponentProps<
    typeof ThirdwebProviderCore
  >["supportedWallets"];
}

/**
 *
 * The `<ThirdwebProvider />` component lets you control what networks you want users to connect to,
 * what types of wallets can connect to your app, and the settings for the [Thirdweb SDK](https://docs.thirdweb.com/typescript).
 *
 * @example
 * You can wrap your application with the provider as follows:
 *
 * ```jsx title="App.jsx"
 * import { ThirdwebProvider } from "@thirdweb-dev/react";
 *
 * const App = () => {
 *   return (
 *     <ThirdwebProvider>
 *       <YourApp />
 *     </ThirdwebProvider>
 *   );
 * };
 * ```
 *
 */
export const ThirdwebProvider: React.FC<ThirdwebProviderProps> = (props) => {
  return (
    <ThirdwebProviderCore
      {...props}
      createWalletStorage={createAsyncLocalStorage}
    />
  );
};
