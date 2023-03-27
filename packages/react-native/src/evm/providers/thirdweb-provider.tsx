import { createAsyncLocalStorage } from "../../core/AsyncStorage";
import { DEFAULT_API_KEY } from "../constants/rpc";
import { coinbaseWallet } from "../wallets/wallets/coinbase-wallet";
import {
  ThirdwebProviderCore,
  ThirdwebProviderCoreProps,
  Wallet,
} from "@thirdweb-dev/react-core";
import { PropsWithChildren } from "react";
import type { Chain, defaultChains } from "@thirdweb-dev/chains";
import { metamaskWallet } from "evm/wallets/wallets/all";

const DEFAULT_WALLETS = [metamaskWallet(), coinbaseWallet()];

interface ThirdwebProviderProps<TChains extends Chain[]>
  extends Omit<ThirdwebProviderCoreProps<TChains>, "supportedWallets"> {
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
  supportedWallets?: Wallet[];
}

/**
 *
 * The `<ThirdwebProvider />` component lets you control what networks you want users to connect to,
 * what types of wallets can connect to your app, and the settings for the [Thirdweb SDK](https://docs.thirdweb.com/typescript).
 *
 * @example
 * You can wrap your application with the provider as follows:
 *
 * import { ThirdwebProvider } from "@thirdweb-dev/react-native";
 *
 * const App = () => {
 *   return (
 *     <ThirdwebProvider>
 *       <YourApp />
 *     </ThirdwebProvider>
 *   );
 * };
 *
 */
export const ThirdwebProvider = <
  TChains extends Chain[] = typeof defaultChains,
>({
  children,
  createWalletStorage = createAsyncLocalStorage,
  thirdwebApiKey = DEFAULT_API_KEY,
  supportedWallets = DEFAULT_WALLETS,
  ...restProps
}: PropsWithChildren<ThirdwebProviderProps<TChains>>) => {
  return (
    <ThirdwebProviderCore
      thirdwebApiKey={thirdwebApiKey}
      supportedWallets={supportedWallets}
      createWalletStorage={createWalletStorage}
      {...restProps}
    >
      {children}
    </ThirdwebProviderCore>
  );
};
