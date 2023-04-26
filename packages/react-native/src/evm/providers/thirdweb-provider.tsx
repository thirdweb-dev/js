import { createAsyncLocalStorage } from "../../core/AsyncStorage";
import { DEFAULT_API_KEY } from "../constants/rpc";
import {
  ThirdwebProviderCore,
  ThirdwebProviderCoreProps,
  Wallet,
} from "@thirdweb-dev/react-core";
import { PropsWithChildren, useMemo, useRef } from "react";
import type { Chain, defaultChains } from "@thirdweb-dev/chains";
import { metamaskWallet } from "../wallets/wallets/metamask-wallet";
import { rainbowWallet } from "../wallets/wallets/rainbow-wallet";
import { SecureStorage } from "../../core/SecureStorage";
import { useCoinbaseWalletListener } from "../wallets/hooks/useCoinbaseWalletListener";
import { localWallet } from "../wallets/wallets/local-wallet";

const DEFAULT_WALLETS = [metamaskWallet(), rainbowWallet()];

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
  authConfig,
  guestMode,
  ...restProps
}: PropsWithChildren<ThirdwebProviderProps<TChains>>) => {
  useCoinbaseWalletListener();
  const addedGuestWalletRef = useRef(false);

  if (supportedWallets.length === 0 && !guestMode) {
    throw new Error(
      "You must provide at least one supported wallet when not in guest mode",
    );
  }

  const wallets = useMemo(() => {
    if (guestMode && !addedGuestWalletRef.current) {
      addedGuestWalletRef.current = true;
      supportedWallets.push(localWallet());
    }

    return supportedWallets;
  }, [guestMode, supportedWallets]);

  return (
    <ThirdwebProviderCore
      thirdwebApiKey={thirdwebApiKey}
      supportedWallets={wallets}
      authConfig={
        authConfig
          ? authConfig.secureStorage
            ? authConfig
            : { ...authConfig, secureStorage: new SecureStorage("auth") }
          : undefined
      }
      guestMode={guestMode}
      createWalletStorage={createWalletStorage}
      {...restProps}
    >
      {children}
    </ThirdwebProviderCore>
  );
};
