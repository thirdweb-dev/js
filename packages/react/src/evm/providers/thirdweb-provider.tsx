import {
  ThirdwebProviderCore,
  ThirdwebProviderCoreProps,
  WalletConfig,
} from "@thirdweb-dev/react-core";
import { WalletUIStatesProvider } from "./wallet-ui-states-provider";
import { ConnectModal } from "../../wallet/ConnectWallet/Modal/ConnectModal";
import { ThemeObjectOrType } from "../../design-system";
import { PropsWithChildren } from "react";
import type { Chain, defaultChains } from "@thirdweb-dev/chains";
import { defaultWallets } from "../../wallet/wallets/defaultWallets";
import { CustomThemeProvider } from "../../design-system/CustomThemeProvider";

interface ThirdwebProviderProps<TChains extends Chain[]>
  extends Omit<
    ThirdwebProviderCoreProps<TChains>,
    "createWalletStorage" | "supportedWallets" | "signer" | "theme"
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

  /**
   * theme to use for all thirdweb components
   * @defaultValue "dark"
   */
  theme?: ThemeObjectOrType;
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
  children,
  theme: _theme,
  ...restProps
}: PropsWithChildren<ThirdwebProviderProps<TChains>>) => {
  const wallets: WalletConfig[] = supportedWallets || defaultWallets;
  const theme = _theme || "dark";

  return (
    <WalletUIStatesProvider theme={theme}>
      <CustomThemeProvider theme={theme}>
        <ThirdwebProviderCore
          {...restProps}
          theme={typeof theme === "string" ? theme : theme.type}
          supportedWallets={wallets}
        >
          {children}
          <ConnectModal />
        </ThirdwebProviderCore>
      </CustomThemeProvider>
    </WalletUIStatesProvider>
  );
};
