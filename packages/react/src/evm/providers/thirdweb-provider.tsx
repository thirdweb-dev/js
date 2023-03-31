import { DEFAULT_API_KEY } from "../constants/rpc";
import {
  Wallet,
  ThirdwebProviderCore,
  ThirdwebProviderCoreProps,
} from "@thirdweb-dev/react-core";
import { WalletUIStatesProvider } from "./wallet-ui-states-provider";
import { ConnectModal } from "../../wallet/ConnectWallet/Connect";
import { ThemeProvider } from "@emotion/react";
import { darkTheme, lightTheme } from "../../design-system";
import { PropsWithChildren } from "react";
import type { Chain, defaultChains } from "@thirdweb-dev/chains";
import { coinbaseWallet } from "../../wallet/wallets/coinbaseWallet";
import { metamaskWallet } from "../../wallet/wallets/metamaskWallet";
import { walletConnectV1 } from "../../wallet/wallets/walletConnectV1";

interface ThirdwebProviderProps<TChains extends Chain[]>
  extends Omit<
    ThirdwebProviderCoreProps<TChains>,
    "createWalletStorage" | "supportedWallets"
  > {
  /**
   * Wallets that will be supported by the dApp
   * @defaultValue [metamaskWallet(), coinbaseWallet(), walletConnectV1()]
   *
   * @example
   * ```jsx
   * import { metamaskWallet, coinbaseWallet, walletConnectV1 } from "@thirdweb-dev/react";
   *
   * <ThirdwebProvider
   *  supportedWallets={[metamaskWallet(), coinbaseWallet(), walletConnectV1()]}
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
  thirdwebApiKey = DEFAULT_API_KEY,
  supportedWallets,
  theme,
  children,
  ...restProps
}: PropsWithChildren<ThirdwebProviderProps<TChains>>) => {
  return (
    <WalletUIStatesProvider theme={theme}>
      <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
        <ThirdwebProviderCore
          theme={theme}
          thirdwebApiKey={thirdwebApiKey}
          supportedWallets={
            supportedWallets || [
              metamaskWallet(),
              coinbaseWallet(),
              walletConnectV1(),
            ]
          }
          {...restProps}
        >
          {children}
          <ConnectModal />
        </ThirdwebProviderCore>
      </ThemeProvider>
    </WalletUIStatesProvider>
  );
};
