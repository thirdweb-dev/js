import {
  CoinbaseWallet,
  DeviceWallet,
  MetamaskWallet,
} from "../../wallet/wallets";
import { DEFAULT_API_KEY } from "../constants/rpc";
import {
  SupportedWallet,
  ThirdwebProviderCore,
  ThirdwebProviderCoreProps,
} from "@thirdweb-dev/react-core";

const DEFAULT_WALLETS = [MetamaskWallet, CoinbaseWallet, DeviceWallet] as [
  typeof MetamaskWallet,
  typeof CoinbaseWallet,
  typeof DeviceWallet,
];

interface ThirdwebProviderProps
  extends Omit<
    ThirdwebProviderCoreProps,
    "createWalletStorage" | "supportedWallets"
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
  supportedWallets?: SupportedWallet[];
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
export const ThirdwebProvider: React.FC<ThirdwebProviderProps> = ({
  thirdwebApiKey = DEFAULT_API_KEY,
  supportedWallets = DEFAULT_WALLETS,
  ...restProps
}) => {
  return (
    <ThirdwebProviderCore
      thirdwebApiKey={thirdwebApiKey}
      supportedWallets={supportedWallets}
      {...restProps}
    />
  );
};
