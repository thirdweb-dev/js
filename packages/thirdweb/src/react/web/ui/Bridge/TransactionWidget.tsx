"use client";

import { useQuery } from "@tanstack/react-query";
import { trackPayEvent } from "../../../../analytics/track/pay.js";
import type { Token } from "../../../../bridge/index.js";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../constants/addresses.js";
import { getToken } from "../../../../pay/convert/get-token.js";
import type { SupportedFiatCurrency } from "../../../../pay/convert/type.js";
import type { PurchaseData } from "../../../../pay/types.js";
import {
  type PreparedTransaction,
  prepareTransaction,
} from "../../../../transaction/prepare-transaction.js";
import { type Address, checksumAddress } from "../../../../utils/address.js";
import { stringify } from "../../../../utils/json.js";
import { toUnits } from "../../../../utils/units.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../wallets/smart/types.js";
import type { AppMetadata } from "../../../../wallets/types.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import { CustomThemeProvider } from "../../../core/design-system/CustomThemeProvider.js";
import { iconSize, type Theme } from "../../../core/design-system/index.js";
import type { SiweAuthOptions } from "../../../core/hooks/auth/useSiweAuth.js";
import type { ConnectButton_connectModalOptions } from "../../../core/hooks/connection/ConnectButtonProps.js";
import type { SupportedTokens } from "../../../core/utils/defaultTokens.js";
import { AccentFailIcon } from "../ConnectWallet/icons/AccentFailIcon.js";
import { useConnectLocale } from "../ConnectWallet/locale/getConnectLocale.js";
import { EmbedContainer } from "../ConnectWallet/Modal/ConnectEmbed.js";
import { DynamicHeight } from "../components/DynamicHeight.js";
import { Spacer } from "../components/Spacer.js";
import { Spinner } from "../components/Spinner.js";
import { Text } from "../components/text.js";
import type { LocaleId } from "../types.js";
import { BridgeOrchestrator, type UIOptions } from "./BridgeOrchestrator.js";
import { UnsupportedTokenScreen } from "./UnsupportedTokenScreen.js";

export type TransactionWidgetProps = {
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
   * Set the theme for the `TransactionWidget` component. By default it is set to `"dark"`
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
   *  return <TransactionWidget client={client} theme={customTheme} />
   * }
   * ```
   */
  theme?: "light" | "dark" | Theme;

  /**
   * Customize the options for "Connect" Button showing in the TransactionWidget UI when the user is not connected to a wallet.
   *
   * Refer to the [`TransactionWidgetConnectOptions`](https://portal.thirdweb.com/references/typescript/v5/TransactionWidgetConnectOptions) type for more details.
   */
  connectOptions?: TransactionWidgetConnectOptions;

  /**
   * All wallet IDs included in this array will be hidden from wallet selection when connected.
   */
  hiddenWallets?: WalletId[];

  /**
   * The wallet that should be pre-selected in the TransactionWidget UI.
   */
  activeWallet?: Wallet;

  style?: React.CSSProperties;

  className?: string;

  /**
   * Whether to show thirdweb branding in the widget.
   * @default true
   */
  showThirdwebBranding?: boolean;

  /**
   * The token address needed to complete this transaction. Leave undefined if no token is required.
   */
  tokenAddress?: Address;

  /**
   * The price of the item **(as a decimal string)**, e.g. "1.5" for 1.5 tokens.
   */
  amount?: string;

  /**
   * A title for the transaction.
   */
  title?: string;

  /**
   * The transaction description.
   */
  description?: string;

  /**
   * An image URL to show on the widget, such as an NFT image.
   */
  image?: string;

  /**
   * Whether the user or the seller pays the protocol fees. Defaults to the user.
   */
  feePayer?: "user" | "seller";

  /**
   * Preset fiat amounts to display in the UI. Defaults to [5, 10, 20].
   */
  presetOptions?: [number, number, number];

  /**
   * Arbitrary data to be included in the returned status and webhook events.
   */
  purchaseData?: PurchaseData;

  /**
   * Callback triggered when the purchase is successful.
   */
  onSuccess?: () => void;

  /**
   * Callback triggered when the purchase encounters an error.
   */
  onError?: (error: Error) => void;

  /**
   * Callback triggered when the user cancels the purchase.
   */
  onCancel?: () => void;

  /**
   * Arbitrary data to be included in the returned status and webhook events.
   */
  transaction: PreparedTransaction;

  /**
   * @hidden
   */
  paymentLinkId?: string;

  /**
   * Allowed payment methods
   * @default ["crypto", "card"]
   */
  paymentMethods?: ("crypto" | "card")[];

  /**
   * The currency to use for the payment.
   * @default "USD"
   */
  currency?: SupportedFiatCurrency;
};

// Enhanced UIOptions to handle unsupported token state
type UIOptionsResult =
  | { type: "success"; data: UIOptions }
  | {
      type: "indexing_token";
      token: Token;
      chain: Chain;
    }
  | {
      type: "unsupported_token";
      tokenAddress: Address;
      chain: Chain;
    };

/**
 * Widget a prebuilt UI for purchasing a specific token.
 *
 * @param props - Props of type [`TransactionWidgetProps`](https://portal.thirdweb.com/references/typescript/v5/TransactionWidgetProps) to configure the TransactionWidget component.
 *
 * @example
 * ### Default configuration
 *
 * By default, the `TransactionWidget` component will allows users to fund their wallets with crypto or fiat on any of the supported chains..
 *
 * ```tsx
 * <TransactionWidget
 *   client={client}
 *   transaction={prepareTransaction({
 *     to: "0x...",
 *     chain: ethereum,
 *     client: client,
 *   })}
 *   amount="0.1"
 *  />
 * ```
 *
 * ### Customize the UI
 *
 * You can customize the UI of the `TransactionWidget` component by passing a custom theme object to the `theme` prop.
 *
 * ```tsx
 * <TransactionWidget
 *   client={client}
 *   transaction={prepareTransaction({
 *     to: "0x...",
 *     chain: ethereum,
 *     client: client,
 *     value: toUnits("0.001", 18),
 *   })}
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
 * ### Update the Title
 *
 * You can update the title of the widget by passing a `title` prop to the `TransactionWidget` component.
 *
 * ```tsx
 * <TransactionWidget
 *   transaction={prepareTransaction({
 *     to: "0x...",
 *     chain: ethereum,
 *     client: client,
 *     value: toUnits("0.001", 18),
 *   })}
 *   client={client}
 *   title="Transaction ETH"
 * />
 * ```
 *
 * ### Configure the wallet connection
 *
 * You can customize the wallet connection flow by passing a `connectOptions` object to the `TransactionWidget` component.
 *
 * ```tsx
 * <TransactionWidget
 *   client={client}
 *   transaction={prepareTransaction({
 *     to: "0x...",
 *     chain: ethereum,
 *     client: client,
 *     value: toUnits("0.001", 18),
 *   })}
 *   connectOptions={{
 *     connectModal: {
 *       size: 'compact',
 *       title: "Sign in",
 *     }
 *   }}
 * />
 * ```
 *
 * Refer to the [`TransactionWidgetConnectOptions`](https://portal.thirdweb.com/references/typescript/v5/TransactionWidgetConnectOptions) type for more details.
 *
 * @bridge Widgets
 */
export function TransactionWidget(props: TransactionWidgetProps) {
  const localeQuery = useConnectLocale(props.locale || "en_US");
  const theme = props.theme || "dark";

  useQuery({
    queryFn: () => {
      trackPayEvent({
        chainId: props.transaction.chain.id,
        client: props.client,
        event: "ub:ui:transaction_widget:render",
        toToken: props.tokenAddress,
      });
      return true;
    },
    queryKey: ["transaction_widget:render"],
  });

  const bridgeDataQuery = useQuery({
    queryFn: async (): Promise<UIOptionsResult> => {
      let erc20Value = props.transaction.erc20Value;

      if (props.amount) {
        // Get token decimals for conversion
        const tokenAddress = props.tokenAddress || NATIVE_TOKEN_ADDRESS;
        const token = await getToken(
          props.client,
          checksumAddress(tokenAddress),
          props.transaction.chain.id,
        ).catch((e) => {
          if (e instanceof Error && e.message.includes("not supported")) {
            return null;
          }
          throw e;
        });
        if (!token) {
          return {
            chain: props.transaction.chain,
            tokenAddress: checksumAddress(tokenAddress),
            type: "unsupported_token",
          };
        }

        erc20Value = {
          amountWei: toUnits(props.amount, token.decimals),
          tokenAddress: checksumAddress(tokenAddress),
        };
      }

      const transaction = prepareTransaction({
        ...props.transaction,
        erc20Value,
      });

      return {
        data: {
          currency: props.currency || "USD",
          metadata: {
            description: props.description,
            image: props.image,
            title: props.title,
          },
          mode: "transaction",
          transaction,
        },
        type: "success",
      };
    },
    queryKey: ["bridgeData", stringify(props)],
    retry: 1,
  });

  let content = null;
  if (!localeQuery.data || bridgeDataQuery.isLoading) {
    content = (
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          minHeight: "350px",
        }}
      >
        <Spinner color="secondaryText" size="xl" />
      </div>
    );
  } else if (bridgeDataQuery.error) {
    content = (
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "350px",
        }}
      >
        <AccentFailIcon size={iconSize["3xl"]} />
        <Spacer y="lg" />
        <Text color="secondaryText" size="md">
          {bridgeDataQuery.error.message}
        </Text>
      </div>
    );
  } else if (bridgeDataQuery.data?.type === "unsupported_token") {
    // Show unsupported token screen
    content = (
      <UnsupportedTokenScreen
        chain={bridgeDataQuery.data.chain}
        client={props.client}
        tokenAddress={props.tokenAddress}
      />
    );
  } else if (bridgeDataQuery.data?.type === "success") {
    // Show normal bridge orchestrator
    content = (
      <BridgeOrchestrator
        client={props.client}
        connectLocale={localeQuery.data}
        connectOptions={props.connectOptions}
        onCancel={() => {
          props.onCancel?.();
        }}
        onComplete={() => {
          props.onSuccess?.();
        }}
        onError={(err: Error) => {
          props.onError?.(err);
        }}
        paymentLinkId={props.paymentLinkId}
        paymentMethods={props.paymentMethods}
        presetOptions={props.presetOptions}
        purchaseData={props.purchaseData}
        receiverAddress={undefined}
        uiOptions={bridgeDataQuery.data.data}
        showThirdwebBranding={props.showThirdwebBranding}
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
 * Connection options for the `TransactionWidget` component
 *
 * @example
 * ```tsx
 * <TransactionWidget client={client} connectOptions={{
 *    connectModal: {
 *      size: 'compact',
 *      title: "Sign in",
 *    }
 *  }}
 * />
 * ```
 */
type TransactionWidgetConnectOptions = {
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
