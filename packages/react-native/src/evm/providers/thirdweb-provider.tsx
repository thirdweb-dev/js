import { createAsyncLocalStorage } from "../../core/AsyncStorage";
import { DEFAULT_API_KEY } from "../constants/rpc";
import {
  ThirdwebProviderCore,
  ThirdwebProviderCoreProps,
  WalletConfig,
} from "@thirdweb-dev/react-core";
import { PropsWithChildren } from "react";
import type { Chain, defaultChains } from "@thirdweb-dev/chains";
import { SecureStorage } from "../../core/SecureStorage";
import { useCoinbaseWalletListener } from "../wallets/hooks/useCoinbaseWalletListener";
import { DEFAULT_WALLETS } from "../constants/wallets";
import { DappContextProvider } from "./context-provider";
import { UIContextProvider } from "./ui-context-provider";
import { MainModal } from "../components/MainModal";
import { ThemeProvider } from "../styles/ThemeProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface ThirdwebProviderProps<TChains extends Chain[]>
  extends Omit<ThirdwebProviderCoreProps<TChains>, "supportedWallets"> {
  /**
   * Wallets that will be supported by the dApp
   * @defaultValue [MetaMaskWallet, CoinbaseWallet]
   *
   * @example
   * ```jsx
   * import { MetaMaskWallet, CoinbaseWallet } from "@thirdweb-dev/react";
   *
   * <ThirdwebProvider
   *  supportedWallets={[MetaMaskWallet, CoinbaseWallet]}
   * />
   * ```
   */
  supportedWallets?: WalletConfig<any, any>[];
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
  authConfig,
  theme,
  ...restProps
}: PropsWithChildren<ThirdwebProviderProps<TChains>>) => {
  useCoinbaseWalletListener();

  return (
    <ThirdwebProviderCore
      thirdwebApiKey={thirdwebApiKey}
      supportedWallets={supportedWallets}
      authConfig={
        authConfig
          ? authConfig.secureStorage
            ? authConfig
            : { ...authConfig, secureStorage: new SecureStorage("auth") }
          : undefined
      }
      createWalletStorage={createWalletStorage}
      {...restProps}
    >
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <UIContextProvider>
            <SafeAreaProvider>
              <DappContextProvider>
                {children}
                <MainModal />
              </DappContextProvider>
            </SafeAreaProvider>
          </UIContextProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </ThirdwebProviderCore>
  );
};
