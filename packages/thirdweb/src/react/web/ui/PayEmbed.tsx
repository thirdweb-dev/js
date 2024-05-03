import { useState } from "react";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { SiweAuthOptions } from "../../../exports/react.js";
import type { SmartWalletOptions } from "../../../exports/wallets.js";
import type { Wallet } from "../../../exports/wallets.js";
import type { AppMetadata } from "../../../wallets/types.js";
import { ConnectButton } from "./ConnectWallet/ConnectButton.js";
import type {
  ConnectButton_connectModalOptions,
  PayUIOptions,
} from "./ConnectWallet/ConnectButtonProps.js";
import {
  type SupportedTokens,
  defaultTokens,
} from "./ConnectWallet/defaultTokens.js";
import { useConnectLocale } from "./ConnectWallet/locale/getConnectLocale.js";
import BuyScreen from "./ConnectWallet/screens/Buy/BuyScreen.js";
import { BuyTxHistory } from "./ConnectWallet/screens/Buy/tx-history/BuyTxHistory.js";
import { DynamicHeight } from "./components/DynamicHeight.js";
import { Spinner } from "./components/Spinner.js";
import { Container } from "./components/basic.js";
import { CustomThemeProvider } from "./design-system/CustomThemeProvider.js";
import { type Theme, radius } from "./design-system/index.js";
import type { LocaleId } from "./types.js";

// TODO - JS doc

export function PayEmbed(props: {
  supportedTokens?: SupportedTokens;
  client: ThirdwebClient;
  locale?: LocaleId;
  payOptions?: PayUIOptions;
  theme?: "light" | "dark" | Theme;
  connectOptions?: PayEmbedConnectOptions;
}) {
  const localeQuery = useConnectLocale(props.locale || "en_US");
  const [screen, setScreen] = useState<"buy" | "tx-history">("buy");

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
  } else if (screen === "tx-history") {
    content = (
      <BuyTxHistory
        client={props.client}
        onBack={() => {
          setScreen("buy");
        }}
        closeModal={() => {
          // noop
        }}
      />
    );
  } else {
    content = (
      <BuyScreen
        supportedTokens={props.supportedTokens || defaultTokens}
        theme={props.theme || "dark"}
        client={props.client}
        connectLocale={localeQuery.data}
        onViewPendingTx={() => {
          setScreen("tx-history");
        }}
        payOptions={{
          buyWithCrypto: props.payOptions?.buyWithCrypto,
          buyWithFiat: props.payOptions?.buyWithFiat,
        }}
        closeModal={() => {
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
          />
        }
      />
    );
  }

  return (
    <CustomThemeProvider theme={props.theme || "dark"}>
      <Container
        bg="modalBg"
        style={{
          borderRadius: radius.lg,
          minWidth: "360px",
          borderWidth: "1px",
          borderStyle: "solid",
          position: "relative",
          overflow: "hidden",
        }}
        borderColor="borderColor"
      >
        <DynamicHeight>{content}</DynamicHeight>
      </Container>
    </CustomThemeProvider>
  );
}

export type PayEmbedConnectOptions = {
  /**
   * Configurations for the `ConnectButton`'s Modal that is shown for connecting a wallet
   * Refer to the [`ConnectButton_connectModalOptions`](https://portal.thirdweb.com/references/typescript/v5/ConnectButton_connectModalOptions) type for more details
   * @example
   * ```tsx
   * <ConnectButton connectModal={{ size: "compact" }} />
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
   * ```tsx
   * <ConnectButton
   *   accountAbstraction={{
   *    factoryAddress: "0x123...",
   *    chain: sepolia,
   *    gasless: true;
   *   }}
   * />
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
   * ```tsx
   * <ConnectButton client={client} autoConnect={{ timeout: 10000 }} />
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
   * ```tsx
   * <ConnectButton chains={[ethereum, polygon, optimism]} />
   * ```
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
