import { DEFAULT_API_KEY } from "../constants/rpc";
import {
  ThirdwebProviderCore,
  ThirdwebProviderCoreProps,
  WalletConfig,
} from "@thirdweb-dev/react-core";
import { WalletUIStatesProvider } from "./wallet-ui-states-provider";
import { ConnectModal } from "../../wallet/ConnectWallet/ConnectModal";
import { ThemeProvider } from "@emotion/react";
import { darkTheme, lightTheme } from "../../design-system";
import { PropsWithChildren } from "react";
import type { Chain, defaultChains } from "@thirdweb-dev/chains";
import { defaultWallets } from "../../wallet/wallets/defaultWallets";

interface ThirdwebProviderProps<TChains extends Chain[]>
  extends Omit<
    ThirdwebProviderCoreProps<TChains>,
    "createWalletStorage" | "supportedWallets"
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
  apiKey: apiKey,
  supportedWallets,
  theme,
  children,
  ...restProps
}: PropsWithChildren<ThirdwebProviderProps<TChains>>) => {
  const wallets: WalletConfig[] = supportedWallets || defaultWallets;

  if (!apiKey) {
    apiKey = DEFAULT_API_KEY;
    noAPIKeyWarning();
  }

  return (
    <WalletUIStatesProvider theme={theme}>
      <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
        <ThirdwebProviderCore
          theme={theme}
          apiKey={apiKey}
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

let noAPIKeyWarningLogged = false;
function noAPIKeyWarning() {
  if (noAPIKeyWarningLogged) {
    return;
  }
  noAPIKeyWarningLogged = true;
  console.warn(
    "No API key provided to <ThirdwebProvider />. You will have limited access to thirdweb's services for storage, RPC, and account abstraction. You can get an API key from https://thirdweb.com/dashboard/",
  );
}
