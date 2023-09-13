import {
  ThirdwebProviderCore,
  ThirdwebProviderCoreProps,
  WalletConfig,
} from "@thirdweb-dev/react-core";
import { WalletUIStatesProvider } from "./wallet-ui-states-provider";
import { ConnectModal } from "../../wallet/ConnectWallet/Modal/ConnectModal";
import { ThemeProvider } from "@emotion/react";
import { darkThemeObj, lightThemeObj } from "../../design-system";
import { PropsWithChildren } from "react";
import type { Chain, defaultChains } from "@thirdweb-dev/chains";
import { defaultWallets } from "../../wallet/wallets/defaultWallets";

interface ThirdwebProviderProps<TChains extends Chain[]>
  extends Omit<
    ThirdwebProviderCoreProps<TChains>,
    "createWalletStorage" | "supportedWallets" | "signer"
  > {
  /**
   * Wallets supported by the dApp
   * @defaultValue `[ metamaskWallet(), coinbaseWallet(), walletConnect() ]`
   *
   * @example
   * ```jsx
   * import { metamaskWallet, coinbaseWallet, walletConnect } from "@thirdweb-dev/react";
   *
   * <ThirdwebProvider
   *  supportedWallets={[metamaskWallet(), coinbaseWallet(), walletConnect()]}
   * />
   * ```
   */
  supportedWallets?: WalletConfig<any>[];
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
export const ThirdwebProvider = <
  TChains extends Chain[] = typeof defaultChains,
>({
  supportedWallets,
  theme,
  children,
  ...restProps
}: PropsWithChildren<ThirdwebProviderProps<TChains>>) => {
  const wallets: WalletConfig[] = supportedWallets || defaultWallets;

  return (
    <WalletUIStatesProvider theme={theme} modalSize="wide">
      <ThemeProvider theme={theme === "dark" ? darkThemeObj : lightThemeObj}>
        <ThirdwebProviderCore
          theme={theme}
          supportedWallets={wallets}
          {...restProps}
        >
          {children}
          <ConnectModal />
        </ThirdwebProviderCore>
      </ThemeProvider>
    </WalletUIStatesProvider>
  );
};
