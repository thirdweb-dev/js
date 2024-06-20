"use client";

import { useState } from "react";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../wallets/smart/types.js";
import type { AppMetadata } from "../../../wallets/types.js";
import { CustomThemeProvider } from "../../core/design-system/CustomThemeProvider.js";
import { type Theme, radius } from "../../core/design-system/index.js";
import type { SiweAuthOptions } from "../../core/hooks/auth/useSiweAuth.js";
import { ConnectButton } from "./ConnectWallet/ConnectButton.js";
import type {
  ConnectButton_connectModalOptions,
  PayUIOptions,
} from "./ConnectWallet/ConnectButtonProps.js";
import type { SupportedTokens } from "./ConnectWallet/defaultTokens.js";
import { useConnectLocale } from "./ConnectWallet/locale/getConnectLocale.js";
import BuyScreen from "./ConnectWallet/screens/Buy/BuyScreen.js";
import { BuyTxHistory } from "./ConnectWallet/screens/Buy/tx-history/BuyTxHistory.js";
import { DynamicHeight } from "./components/DynamicHeight.js";
import { Spinner } from "./components/Spinner.js";
import { Container } from "./components/basic.js";
import type { LocaleId } from "./types.js";

/**
 * Props of [`PayEmbed`](https://portal.thirdweb.com/references/typescript/v5/PayEmbed) component
 */
export type PayEmbedProps = {
  /**
   * Override the default tokens shown in PayEmbed uI
   *
   * By default, PayEmbed shows a few popular tokens for Pay supported chains
   * @example
   *
   * `supportedTokens` prop allows you to override this list as shown below.
   *
   * ```tsx
   * import { PayEmbed } from 'thirdweb/react';
   * import { NATIVE_TOKEN_ADDRESS } from 'thirdweb';
   *
   * function Example() {
   *   return (
   * 		<PayEmbed
   * 			supportedTokens={{
   *        // Override the tokens for Base Mainnet ( chaid id 84532 )
   * 				84532: [
   * 					{
   * 						address: NATIVE_TOKEN_ADDRESS, // use NATIVE_TOKEN_ADDRESS for native token
   * 						name: 'Base ETH',
   * 						symbol: 'ETH',
   * 						icon: 'https://...',
   * 					},
   *          {
   * 						address: '0x...', // token contract address
   * 						name: 'Dai Stablecoin',
   * 						symbol: 'DAI',
   * 						icon: 'https://...',
   * 					},
   * 				],
   * 			}}
   * 		/>
   * 	);
   * }
   * ```
   */
  supportedTokens?: SupportedTokens;
  /**
   * A client is the entry point to the thirdweb SDK.
   * It is required for all other actions.
   * You can create a client using the `createThirdwebClient` function. Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   * You must provide a `clientId` or `secretKey` in order to initialize a client. Pass `clientId` if you want for client-side usage and `secretKey` for server-side usage.
   *
   * ```tsx
   * import { createThirdwebClient } from "thirdweb";
   *
   * const client = createThirdwebClient({
   *  clientId: "<your_client_id>",
   * })
   * ```
   */
  client: ThirdwebClient;
  /**
   * By default - ConnectButton UI uses the `en-US` locale for english language users.
   *
   * You can customize the language used in the ConnectButton UI by setting the `locale` prop.
   *
   * Refer to the [`LocaleId`](https://portal.thirdweb.com/references/typescript/v5/LocaleId) type for supported locales.
   */
  locale?: LocaleId;
  /**
   * Customize the Pay UI options. Refer to the [`PayUIOptions`](https://portal.thirdweb.com/references/typescript/v5/PayUIOptions) type for more details.
   */
  payOptions?: PayUIOptions;

  /**
   * Set the theme for the `PayEmbed` component. By default it is set to `"dark"`
   *
   * theme can be set to either `"dark"`, `"light"` or a custom theme object.
   * You can also import [`lightTheme`](https://portal.thirdweb.com/references/typescript/v5/lightTheme)
   * or [`darkTheme`](https://portal.thirdweb.com/references/typescript/v5/darkTheme)
   * functions from `thirdweb/react` to use the default themes as base and overrides parts of it.
   * @example
   * ```ts
   * import { lightTheme } from "thirdweb/react";
   *
   * const customTheme = lightTheme({
   *  colors: {
   *    modalBg: 'red'
   *  }
   * })
   *
   * function Example() {
   *  return <PayEmbed client={client} theme={customTheme} />
   * }
   * ```
   */
  theme?: "light" | "dark" | Theme;

  /**
   * Customize the options for "Connect" Button showin in the PayEmbed UI when the user is not connected to a wallet.
   *
   * Refer to the [`PayEmbedConnectOptions`](https://portal.thirdweb.com/references/typescript/v5/PayEmbedConnectOptions) type for more details.
   */
  connectOptions?: PayEmbedConnectOptions;

  style?: React.CSSProperties;
};

/**
 * Embed thirdweb Pay UI for Buy tokens using Crypto or Credit Card.
 *
 * PayEmbed also renders a "Connect" button if the user is not connected to a wallet. You can customize the options for "Connect" button using the `connectOptions` prop.
 *
 * @param props - Props of type [`PayEmbedProps`](https://portal.thirdweb.com/references/typescript/v5/PayEmbedProps) to configure the PayEmbed component.
 *
 * @example
 * ```tsx
 * <PayEmbed
 *   client={client}
 *   connectOptions={{
 *     connectModal: {
 *       size: 'compact',
 *     }
 *   }}
 *   payOptions={{
 *     buyWithCrypto: false,
 *   }}
 *  />
 * ```
 */
export function PayEmbed(props: PayEmbedProps) {
  const localeQuery = useConnectLocale(props.locale || "en_US");
  const [screen, setScreen] = useState<"buy" | "tx-history">("buy");
  const theme = props.theme || "dark";

  let content = null;

  if (!localeQuery.data) {
    content = (
      <div
        style={{
          minHeight: "350px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner size="xl" color="secondaryText" />
      </div>
    );
  } else {
    // show and hide screens with CSS to not lose state when switching between them
    content = (
      <>
        <div style={{ display: screen === "tx-history" ? "none" : "inherit" }}>
          <BuyScreen
            isEmbed={true}
            supportedTokens={props.supportedTokens}
            theme={theme}
            client={props.client}
            connectLocale={localeQuery.data}
            onViewPendingTx={() => {
              setScreen("tx-history");
            }}
            payOptions={props.payOptions || {}}
            onDone={() => {
              // noop
            }}
            connectButton={
              <ConnectButton
                {...props.connectOptions}
                client={props.client}
                connectButton={{
                  style: {
                    width: "100%",
                  },
                }}
                theme={theme}
              />
            }
          />
        </div>
        {/* this does not need to persist so we can just show-hide it with JS */}
        {screen === "tx-history" && (
          <BuyTxHistory
            client={props.client}
            onBack={() => {
              setScreen("buy");
            }}
            onDone={() => {
              // noop
            }}
            isBuyForTx={false}
            isEmbed={true}
          />
        )}
      </>
    );
  }

  return (
    <CustomThemeProvider theme={theme}>
      <Container
        bg="modalBg"
        style={{
          borderRadius: radius.lg,
          minWidth: "360px",
          borderWidth: "1px",
          borderStyle: "solid",
          position: "relative",
          overflow: "hidden",
          ...props.style,
        }}
        borderColor="borderColor"
      >
        <DynamicHeight>{content}</DynamicHeight>
      </Container>
    </CustomThemeProvider>
  );
}

/**
 * Connection options for the `PayEmbed` component
 *
 * @example
 * ```tsx
 * <PayEmbed client={client} connectOptions={{
 *    connectModal: {
 *      size: 'compact',
 *      title: "Sign in",
 *    }
 *  }}
 * />
 * ```
 */
export type PayEmbedConnectOptions = {
  /**
   * Configurations for the `ConnectButton`'s Modal that is shown for connecting a wallet
   * Refer to the [`ConnectButton_connectModalOptions`](https://portal.thirdweb.com/references/typescript/v5/ConnectButton_connectModalOptions) type for more details
   */
  connectModal?: ConnectButton_connectModalOptions;

  /**
   * Configure options for WalletConnect
   *
   * By default WalletConnect uses the thirdweb's default project id.
   * Setting your own project id is recommended.
   *
   * You can create a project id by signing up on [walletconnect.com](https://walletconnect.com/)
   */
  walletConnect?: {
    projectId?: string;
  };

  /**
   * Enable Account abstraction for all wallets. This will connect to the users's smart account based on the connected personal wallet and the given options.
   *
   * This allows to sponsor gas fees for your user's transaction using the thirdweb account abstraction infrastructure.
   *
   */
  accountAbstraction?: SmartWalletOptions;

  /**
   * Array of wallets to show in Connect Modal. If not provided, default wallets will be used.
   */
  wallets?: Wallet[];
  /**
   * When the user has connected their wallet to your site, this configuration determines whether or not you want to automatically connect to the last connected wallet when user visits your site again in the future.
   *
   * By default it is set to `{ timeout: 15000 }` meaning that autoConnect is enabled and if the autoConnection does not succeed within 15 seconds, it will be cancelled.
   *
   * If you want to disable autoConnect, set this prop to `false`.
   *
   * If you want to customize the timeout, you can assign an object with a `timeout` key to this prop.
   * ```
   */
  autoConnect?:
    | {
        timeout: number;
      }
    | boolean;

  /**
   * Metadata of the app that will be passed to connected wallet. Setting this is highly recommended.
   */
  appMetadata?: AppMetadata;

  /**
   * The [`Chain`](https://portal.thirdweb.com/references/typescript/v5/Chain) object of the blockchain you want the wallet to connect to
   *
   * If a `chain` is not specified, Wallet will be connected to whatever is the default set in the wallet.
   *
   * If a `chain` is specified, Wallet will be prompted to switch to given chain after connection if it is not already connected to it.
   * This ensures that the wallet is connected to the correct blockchain before interacting with your app.
   *
   * The `ConnectButton` also shows a "Switch Network" button until the wallet is connected to the specified chain. Clicking on the "Switch Network" button triggers the wallet to switch to the specified chain.
   *
   * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
   * At minimum, you need to pass the `id` of the blockchain to `defineChain` function to create a `Chain` object.
   * ```
   */
  chain?: Chain;

  /**
   * Array of chains that your app supports.
   *
   * This is only relevant if your app is a multi-chain app and works across multiple blockchains.
   * If your app only works on a single blockchain, you should only specify the `chain` prop.
   *
   * Given list of chains will used in various ways:
   * - They will be displayed in the network selector in the `ConnectButton`'s details modal post connection
   * - They will be sent to wallet at the time of connection if the wallet supports requesting multiple chains ( example: WalletConnect ) so that users can switch between the chains post connection easily
   *
   * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
   * At minimum, you need to pass the `id` of the blockchain to `defineChain` function to create a `Chain` object.
   *
   * ```tsx
   * import { defineChain } from "thirdweb/react";
   *
   * const polygon = defineChain({
   *   id: 137,
   * });
   * ```
   */
  chains?: Chain[];

  /**
   * Wallets to show as recommended in the `ConnectButton`'s Modal
   */
  recommendedWallets?: Wallet[];

  /**
   * By default, ConnectButton modal shows a "All Wallets" button that shows a list of 350+ wallets.
   *
   * You can disable this button by setting `showAllWallets` prop to `false`
   */
  showAllWallets?: boolean;

  /**
   * Enable SIWE (Sign in with Ethererum) by passing an object of type `SiweAuthOptions` to
   * enforce the users to sign a message after connecting their wallet to authenticate themselves.
   *
   * Refer to the [`SiweAuthOptions`](https://portal.thirdweb.com/references/typescript/v5/SiweAuthOptions) for more details
   */
  auth?: SiweAuthOptions;
};
