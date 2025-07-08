"use client";

import { useEffect } from "react";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { Address } from "../../../utils/address.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../wallets/smart/types.js";
import type { AppMetadata } from "../../../wallets/types.js";
import type { WalletId } from "../../../wallets/wallet-types.js";
import { CustomThemeProvider } from "../../core/design-system/CustomThemeProvider.js";
import type { Theme } from "../../core/design-system/index.js";
import type { SiweAuthOptions } from "../../core/hooks/auth/useSiweAuth.js";
import type {
  ConnectButton_connectModalOptions,
  PayUIOptions,
} from "../../core/hooks/connection/ConnectButtonProps.js";
import { useConnectionManager } from "../../core/providers/connection-manager.js";
import type { SupportedTokens } from "../../core/utils/defaultTokens.js";
import { BuyWidget } from "./Bridge/BuyWidget.js";
import { CheckoutWidget } from "./Bridge/CheckoutWidget.js";
import { TransactionWidget } from "./Bridge/TransactionWidget.js";
import { EmbedContainer } from "./ConnectWallet/Modal/ConnectEmbed.js";
import { DynamicHeight } from "./components/DynamicHeight.js";
import type { LocaleId } from "./types.js";

/**
 * Props of [`PayEmbed`](https://portal.thirdweb.com/references/typescript/v5/PayEmbed) component
 */
export type PayEmbedProps = {
  /**
   * Override the default tokens shown in PayEmbed UI
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
   * Customize the options for "Connect" Button showing in the PayEmbed UI when the user is not connected to a wallet.
   *
   * Refer to the [`PayEmbedConnectOptions`](https://portal.thirdweb.com/references/typescript/v5/PayEmbedConnectOptions) type for more details.
   */
  connectOptions?: PayEmbedConnectOptions;

  /**
   * All wallet IDs included in this array will be hidden from wallet selection when connected.
   */
  hiddenWallets?: WalletId[];

  /**
   * The wallet that should be pre-selected in the PayEmbed UI.
   */
  activeWallet?: Wallet;

  style?: React.CSSProperties;

  className?: string;

  /**
   * @hidden
   */
  paymentLinkId?: string;
};

/**
 * Embed a prebuilt UI for funding wallets, purchases or transactions with crypto or fiat.
 *
 * @param props - Props of type [`PayEmbedProps`](https://portal.thirdweb.com/references/typescript/v5/PayEmbedProps) to configure the PayEmbed component.
 *
 * @example
 * ### Default configuration
 *
 * By default, the `PayEmbed` component will allows users to fund their wallets with crypto or fiat on any of the supported chains..
 *
 * ```tsx
 * <PayEmbed
 *   client={client}
 *  />
 * ```
 *
 * ### Top up wallets
 *
 * You can set the `mode` option to `"fund_wallet"` to allow users to top up their wallets with crypto or fiat.
 *
 * ```tsx
 * <PayEmbed
 *   client={client}
 *   payOptions={{
 *     mode: "fund_wallet",
 *     metadata: {
 *       name: "Get funds", // title of the payment modal
 *     },
 *     prefillBuy: {
 *       chain: base, // chain to prefill the buy screen with
 *       amount: "0.01", // amount to prefill the buy screen with
 *     },
 *   }}
 *  />
 * ```
 *
 * ### Direct Payments
 *
 * You can set the `mode` option to `"direct_payment"` to allow users to make a direct payment to a wallet address.
 *
 * ```tsx
 * <PayEmbed
 *   client={client}
 *   theme={"light"}
 *   payOptions={{
 *     mode: "direct_payment",
 *     paymentInfo: {
 *       amount: "35",
 *       chain: base,
 *       token: getDefaultToken(base, "USDC"),
 *       sellerAddress: "0x...", // the wallet address of the seller
 *     },
 *     metadata: {
 *       name: "Black Hoodie (Size L)",
 *       image: "/drip-hoodie.png",
 *     },
 *   }}
 *  />
 * ```
 *
 * ### Transactions
 *
 * You can set the `mode` option to `"transaction"` to allow users to execute a transaction with a different wallet, chain or token.
 *
 * ```tsx
 * <PayEmbed
 *   client={client}
 *   payOptions={{
 *     mode: "transaction",
 *     // can be any transaction
 *     transaction: claimTo({
 *       contract: nftContract,
 *       quantity: 1n,
 *       tokenId: 0n,
 *       to: "0x...",
 *     }),
 *     // this could be any metadata, including NFT metadata
 *     metadata: {
 *       name: "VIP Ticket",
 *       image: "https://...",
 *     },
 *   }}
 *  />
 * ```
 * You can also handle ERC20 payments by passing `erc20value` to your transaction:
 *
 * ```tsx
 * <PayEmbed
 *   client={client}
 *   payOptions={{
 *     mode: "transaction",
 *     transaction: prepareContractCall({
 *       contract: yourContract,
 *       functionName: "purchase",
 *       args: [arg1, arg2, ...],
 *       erc20value: {
 *         token: USDC_TOKEN_ADDRESS, // the erc20 token required to purchase
 *         amount: toUnits("100", 6), // the amount of erc20 token required to purchase
 *       },
 *     }),
 *   }}
 *  />
 * ```
 *
 * ### Enable/Disable payment methods
 *
 * You can disable the use of crypto or fiat by setting the `buyWithCrypto` or `buyWithFiat` options to `false`.
 *
 * ```tsx
 * <PayEmbed
 *   client={client}
 *   payOptions={{
 *     buyWithFiat: false,
 *   }}
 *  />
 * ```
 *
 * ### Customize the UI
 *
 * You can customize the UI of the `PayEmbed` component by passing a custom theme object to the `theme` prop.
 *
 * ```tsx
 * <PayEmbed
 *   client={client}
 *   theme={darkTheme({
 *     colors: {
 *       modalBg: "red",
 *     },
 *   })}
 * />
 * ```
 *
 * Refer to the [`Theme`](https://portal.thirdweb.com/references/typescript/v5/Theme) type for more details.
 *
 * ### Configure the wallet connection
 *
 * You can customize the wallet connection flow by passing a `connectOptions` object to the `PayEmbed` component.
 *
 * ```tsx
 * <PayEmbed
 *   client={client}
 *   connectOptions={{
 *     connectModal: {
 *       size: 'compact',
 *       title: "Sign in",
 *     }
 *   }}
 * />
 * ```
 *
 * Refer to the [`PayEmbedConnectOptions`](https://portal.thirdweb.com/references/typescript/v5/PayEmbedConnectOptions) type for more details.
 *
 * @deprecated Use `BuyWidget`, `CheckoutWidget` or `TransactionWidget` instead.
 */
export function PayEmbed(props: PayEmbedProps) {
  const theme = props.theme || "dark";
  const connectionManager = useConnectionManager();

  // Add props.chain and props.chains to defined chains store
  useEffect(() => {
    if (props.connectOptions?.chain) {
      connectionManager.defineChains([props.connectOptions?.chain]);
    }
  }, [props.connectOptions?.chain, connectionManager]);

  useEffect(() => {
    if (props.connectOptions?.chains) {
      connectionManager.defineChains(props.connectOptions?.chains);
    }
  }, [props.connectOptions?.chains, connectionManager]);

  useEffect(() => {
    if (props.activeWallet) {
      connectionManager.setActiveWallet(props.activeWallet);
    }
  }, [props.activeWallet, connectionManager]);

  const content = null;
  const metadata =
    props.payOptions && "metadata" in props.payOptions
      ? props.payOptions.metadata
      : null;

  if (
    props.payOptions?.mode === "fund_wallet" &&
    props.payOptions?.prefillBuy
  ) {
    return (
      <BuyWidget
        amount={props.payOptions.prefillBuy.amount || "0.01"}
        chain={props.payOptions.prefillBuy.chain}
        client={props.client}
        onSuccess={() => props.payOptions?.onPurchaseSuccess?.()}
        paymentMethods={
          props.payOptions?.buyWithFiat === false
            ? ["crypto"]
            : props.payOptions?.buyWithCrypto === false
              ? ["card"]
              : ["crypto", "card"]
        }
        purchaseData={props.payOptions?.purchaseData}
        theme={theme}
        title={metadata?.name || "Buy"}
        tokenAddress={
          props.payOptions.prefillBuy.token?.address as Address | undefined
        }
      />
    );
  }

  if (props.payOptions?.mode === "direct_payment") {
    return (
      <CheckoutWidget
        amount={(props.payOptions.paymentInfo as { amount: string }).amount}
        chain={props.payOptions.paymentInfo.chain}
        client={props.client}
        description={metadata?.description}
        feePayer={
          props.payOptions.paymentInfo.feePayer === "sender" ? "user" : "seller"
        }
        image={metadata?.image}
        name={metadata?.name || "Checkout"}
        onSuccess={() => props.payOptions?.onPurchaseSuccess?.()}
        paymentMethods={
          props.payOptions?.buyWithFiat === false
            ? ["crypto"]
            : ["crypto", "card"]
        }
        purchaseData={props.payOptions?.purchaseData}
        seller={props.payOptions.paymentInfo.sellerAddress as Address}
        theme={theme}
        tokenAddress={
          props.payOptions.paymentInfo.token?.address as Address | undefined
        }
      />
    );
  }

  if (props.payOptions?.mode === "transaction") {
    return (
      <TransactionWidget
        client={props.client}
        description={metadata?.description}
        image={metadata?.image}
        onSuccess={() => props.payOptions?.onPurchaseSuccess?.()}
        paymentMethods={
          props.payOptions?.buyWithFiat === false
            ? ["crypto"]
            : ["crypto", "card"]
        }
        purchaseData={props.payOptions?.purchaseData}
        theme={theme}
        title={metadata?.name}
        transaction={props.payOptions.transaction}
      />
    );
  }

  return (
    <CustomThemeProvider theme={theme}>
      <EmbedContainer
        className={props.className}
        modalSize="compact"
        style={props.style}
      >
        <DynamicHeight>{content}</DynamicHeight>
      </EmbedContainer>
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
   * By default, ConnectButton modal shows a "All Wallets" button that shows a list of 500+ wallets.
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
