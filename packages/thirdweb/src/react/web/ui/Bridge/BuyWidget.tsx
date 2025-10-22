"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { trackPayEvent } from "../../../../analytics/track/pay.js";
import type { TokenWithPrices } from "../../../../bridge/index.js";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../constants/addresses.js";
import type { SupportedFiatCurrency } from "../../../../pay/convert/type.js";
import type { PurchaseData } from "../../../../pay/types.js";
import type { Address } from "../../../../utils/address.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../wallets/smart/types.js";
import type { AppMetadata } from "../../../../wallets/types.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import { CustomThemeProvider } from "../../../core/design-system/CustomThemeProvider.js";
import type { Theme } from "../../../core/design-system/index.js";
import type { SiweAuthOptions } from "../../../core/hooks/auth/useSiweAuth.js";
import type { ConnectButton_connectModalOptions } from "../../../core/hooks/connection/ConnectButtonProps.js";
import type {
  BridgePrepareRequest,
  BridgePrepareResult,
} from "../../../core/hooks/useBridgePrepare.js";
import type { CompletedStatusResult } from "../../../core/hooks/useStepExecutor.js";
import type { SupportedTokens } from "../../../core/utils/defaultTokens.js";
import { webWindowAdapter } from "../../adapters/WindowAdapter.js";
import connectLocaleEn from "../ConnectWallet/locale/en.js";
import { EmbedContainer } from "../ConnectWallet/Modal/ConnectEmbed.js";
import { DynamicHeight } from "../components/DynamicHeight.js";
import { ErrorBanner } from "./ErrorBanner.js";
import {
  type AmountSelection,
  FundWallet,
  type SelectedToken,
} from "./FundWallet.js";
import { PaymentDetails } from "./payment-details/PaymentDetails.js";
import { PaymentSelection } from "./payment-selection/PaymentSelection.js";
import { SuccessScreen } from "./payment-success/SuccessScreen.js";
import { QuoteLoader } from "./QuoteLoader.js";
import { StepRunner } from "./StepRunner.js";
import type { PaymentMethod, RequiredParams } from "./types.js";

export type BuyOrOnrampPrepareResult = Extract<
  BridgePrepareResult,
  { type: "buy" | "onramp" }
>;

export type BuyWidgetProps = {
  /**
   * Customize the supported tokens that users can pay with.
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
   * Set the theme for the `BuyWidget` component. By default it is set to `"dark"`
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
   *  return <BuyWidget client={client} theme={customTheme} />
   * }
   * ```
   */
  theme?: "light" | "dark" | Theme;

  /**
   * Customize the options for "Connect" Button showing in the BuyWidget UI when the user is not connected to a wallet.
   *
   * Refer to the [`BuyWidgetConnectOptions`](https://portal.thirdweb.com/references/typescript/v5/BuyWidgetConnectOptions) type for more details.
   */
  connectOptions?: BuyWidgetConnectOptions;

  /**
   * All wallet IDs included in this array will be hidden from wallet selection when connected.
   */
  hiddenWallets?: WalletId[];

  /**
   * The wallet that should be pre-selected in the BuyWidget UI.
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
   * The chain the accepted token is on.
   */
  chain?: Chain;

  /**
   * Address of the token to buy. Leave undefined for the native token, or use 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE.
   */
  tokenAddress?: Address;

  /**
   * The amount to buy **(as a decimal string)**, e.g. "1.5" for 1.5 tokens.
   */
  amount?: string;

  /**
   * The title to display in the widget. If `title` is explicity set to an empty string, the title will not be displayed.
   */
  title?: string;

  /**
   * The description to display in the widget.
   */
  description?: string;

  /**
   * The image to display in the widget.
   */
  image?: string;

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
  onSuccess?: (data: {
    quote: BuyOrOnrampPrepareResult;
    statuses: CompletedStatusResult[];
  }) => void;

  /**
   * Callback triggered when the purchase encounters an error.
   */
  onError?: (error: Error, quote: BuyOrOnrampPrepareResult | undefined) => void;

  /**
   * Callback triggered when the user cancels the purchase.
   */
  onCancel?: (quote: BuyOrOnrampPrepareResult | undefined) => void;

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

  /**
   * The user's ISO 3166 alpha-2 country code. This is used to determine onramp provider support.
   */
  country?: string;

  /**
   * Custom label for the main action button.
   */
  buttonLabel?: string;

  /**
   * The receiver address for the purchased funds.
   */
  receiverAddress?: Address;

  /**
   * Callback to be called when the user disconnects the active wallet.
   */
  onDisconnect?: () => void;
};

/**
 * Widget is a prebuilt UI for purchasing a specific token.
 *
 * @param props - Props of type [`BuyWidgetProps`](https://portal.thirdweb.com/references/typescript/v5/BuyWidgetProps) to configure the BuyWidget component.
 *
 * @example
 * ### Basic usage
 *
 * The `BuyWidget` component requires `client`, `chain`, and `amount` props to function.
 *
 * ```tsx
 * import { ethereum } from "thirdweb/chains";
 *
 * <BuyWidget
 *   client={client}
 *   chain={ethereum}
 *   amount="0.1" // in native tokens (ie. ETH)
 * />
 * ```
 *
 * ### Buy a specific token
 *
 * You can specify a token to purchase by passing the `tokenAddress` prop.
 *
 * ```tsx
 * <BuyWidget
 *   client={client}
 *   chain={ethereum}
 *   amount="100" // 100 USDC on mainnet
 *   tokenAddress="0xA0b86a33E6417E4df2057B2d3C6d9F7cc11b0a70"
 * />
 * ```
 *
 * ### Customize the supported tokens
 *
 * You can customize the supported tokens that users can pay with by passing a `supportedTokens` object to the `BuyWidget` component.
 *
 * ```tsx
 * <BuyWidget
 *   client={client}
 *   chain={ethereum}
 *   amount="0.1"
 *   // user will only be able to pay with these tokens
 *   supportedTokens={{
 *     [8453]: [
 *       {
 *         address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
 *         name: "USDC",
 *         symbol: "USDC",
 *       },
 *     ],
 *   }}
 * />
 * ```
 *
 *
 * ### Customize the UI
 *
 * You can customize the UI of the `BuyWidget` component by passing a custom theme object to the `theme` prop.
 *
 * ```tsx
 * <BuyWidget
 *   client={client}
 *   chain={ethereum}
 *   amount="0.1"
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
 * You can update the title of the widget by passing a `title` prop to the `BuyWidget` component.
 *
 * ```tsx
 * <BuyWidget
 *   client={client}
 *   chain={ethereum}
 *   amount="0.1"
 *   title="Buy ETH"
 * />
 * ```
 *
 * ### Configure the wallet connection
 *
 * You can customize the wallet connection flow by passing a `connectOptions` object to the `BuyWidget` component.
 *
 * ```tsx
 * <BuyWidget
 *   client={client}
 *   chain={ethereum}
 *   amount="0.1"
 *   connectOptions={{
 *     connectModal: {
 *       size: 'compact',
 *       title: "Sign in",
 *     }
 *   }}
 * />
 * ```
 *
 * Refer to the [`BuyWidgetConnectOptions`](https://portal.thirdweb.com/references/typescript/v5/BuyWidgetConnectOptions) type for more details.
 *
 * @bridge
 */
export function BuyWidget(props: BuyWidgetProps) {
  useQuery({
    queryFn: () => {
      trackPayEvent({
        client: props.client,
        event: "ub:ui:buy_widget:render",
        toChainId: props.chain?.id,
        toToken: props.tokenAddress,
      });
      return true;
    },
    queryKey: ["buy_widget:render"],
  });

  // if branding is disabled for widget, disable it for connect options too
  const connectOptions = useMemo(() => {
    if (props.showThirdwebBranding === false) {
      return {
        ...props.connectOptions,
        connectModal: {
          ...props.connectOptions?.connectModal,
          showThirdwebBranding: false,
        },
      };
    }
    return props.connectOptions;
  }, [props.connectOptions, props.showThirdwebBranding]);

  return (
    <BridgeWidgetContainer
      theme={props.theme}
      className={props.className}
      style={props.style}
    >
      <BridgeWidgetContent
        {...props}
        theme={props.theme || "dark"}
        currency={props.currency || "USD"}
        paymentMethods={props.paymentMethods || ["crypto", "card"]}
        presetOptions={props.presetOptions || [5, 10, 20]}
        connectOptions={connectOptions}
        showThirdwebBranding={
          props.showThirdwebBranding === undefined
            ? true
            : props.showThirdwebBranding
        }
      />
    </BridgeWidgetContainer>
  );
}

type BuyWidgetScreen =
  | { id: "1:buy-ui" }
  | {
      id: "2:methodSelection";
      destinationAmount: string;
      destinationToken: TokenWithPrices;
      receiverAddress: Address;
    }
  | {
      id: "3:load-quote";
      destinationAmount: string;
      destinationToken: TokenWithPrices;
      receiverAddress: Address;
      paymentMethod: PaymentMethod;
    }
  | {
      id: "4:preview";
      preparedQuote: BridgePrepareResult;
      request: BridgePrepareRequest;
      destinationAmount: string;
      destinationToken: TokenWithPrices;
      paymentMethod: PaymentMethod;
      receiverAddress: Address;
    }
  | {
      id: "5:execute";
      preparedQuote: BridgePrepareResult;
      request: BridgePrepareRequest;
      destinationAmount: string;
      destinationToken: TokenWithPrices;
      paymentMethod: PaymentMethod;
      receiverAddress: Address;
    }
  | {
      id: "6:success";
      completedStatuses: CompletedStatusResult[];
      preparedQuote: BridgePrepareResult;
    }
  | {
      id: "error";
      error: Error;
      preparedQuote: BridgePrepareResult | undefined;
    };

function BridgeWidgetContent(
  props: RequiredParams<
    BuyWidgetProps,
    | "currency"
    | "presetOptions"
    | "showThirdwebBranding"
    | "paymentMethods"
    | "theme"
  >,
) {
  const [screen, setScreen] = useState<BuyWidgetScreen>({ id: "1:buy-ui" });

  const handleError = useCallback(
    (error: Error, quote: BridgePrepareResult | undefined) => {
      console.error(error);
      if (quote?.type === "buy" || quote?.type === "onramp") {
        props.onError?.(error, quote);
      } else {
        props.onError?.(error, undefined);
      }
      setScreen({
        id: "error",
        preparedQuote: quote,
        error,
      });
    },
    [props.onError],
  );

  const handleCancel = useCallback(
    (preparedQuote: BridgePrepareResult | undefined) => {
      if (preparedQuote?.type === "buy" || preparedQuote?.type === "onramp") {
        props.onCancel?.(preparedQuote);
      } else {
        props.onCancel?.(undefined);
      }
    },
    [props.onCancel],
  );

  const [amountSelection, setAmountSelection] = useState<AmountSelection>({
    type: "token",
    value: props.amount ?? "",
  });

  const [selectedToken, setSelectedToken] = useState<SelectedToken>(() => {
    if (!props.chain?.id) {
      return undefined;
    }

    return {
      chainId: props.chain.id,
      tokenAddress: props.tokenAddress || NATIVE_TOKEN_ADDRESS,
    };
  });

  if (screen.id === "1:buy-ui") {
    return (
      <FundWallet
        theme={props.theme}
        onDisconnect={props.onDisconnect}
        client={props.client}
        connectOptions={props.connectOptions}
        onContinue={(destinationAmount, destinationToken, receiverAddress) => {
          setScreen({
            id: "2:methodSelection",
            destinationAmount,
            destinationToken,
            receiverAddress,
          });
        }}
        presetOptions={props.presetOptions}
        receiverAddress={props.receiverAddress}
        showThirdwebBranding={props.showThirdwebBranding}
        metadata={{
          title: props.title,
          description: props.description,
          image: props.image,
        }}
        buttonLabel={props.buttonLabel}
        currency={props.currency}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        amountSelection={amountSelection}
        setAmountSelection={setAmountSelection}
      />
    );
  }

  if (screen.id === "2:methodSelection") {
    return (
      <PaymentSelection
        // from props
        client={props.client}
        connectLocale={connectLocaleEn}
        connectOptions={props.connectOptions}
        paymentMethods={props.paymentMethods}
        currency={props.currency}
        supportedTokens={props.supportedTokens}
        country={props.country}
        // others
        destinationToken={screen.destinationToken}
        destinationAmount={screen.destinationAmount}
        receiverAddress={screen.receiverAddress}
        feePayer={undefined}
        onBack={() => {
          setScreen({ id: "1:buy-ui" });
        }}
        onError={(error) => {
          handleError(error, undefined);
        }}
        onPaymentMethodSelected={(paymentMethod) => {
          setScreen({
            ...screen,
            id: "3:load-quote",
            paymentMethod,
          });
        }}
      />
    );
  }

  if (screen.id === "3:load-quote") {
    return (
      <QuoteLoader
        // from props
        paymentLinkId={props.paymentLinkId}
        purchaseData={props.purchaseData}
        client={props.client}
        // others
        sender={undefined}
        mode="fund_wallet"
        feePayer={undefined}
        amount={screen.destinationAmount}
        destinationToken={screen.destinationToken}
        onBack={() => {
          setScreen({
            ...screen,
            id: "2:methodSelection",
          });
        }}
        onError={(error) => {
          handleError(error, undefined);
        }}
        onQuoteReceived={(preparedQuote, request) => {
          setScreen({
            ...screen,
            id: "4:preview",
            preparedQuote,
            request,
          });
        }}
        paymentMethod={screen.paymentMethod}
        receiver={screen.receiverAddress}
      />
    );
  }

  if (screen.id === "4:preview") {
    return (
      <PaymentDetails
        // from props
        client={props.client}
        currency={props.currency}
        metadata={{
          title: props.title,
          description: props.description,
        }}
        // others
        confirmButtonLabel={undefined}
        onBack={() => {
          setScreen({
            ...screen,
            id: "2:methodSelection",
          });
        }}
        onConfirm={() => {
          setScreen({
            ...screen,
            id: "5:execute",
          });
        }}
        onError={(error) => {
          handleError(error, screen.preparedQuote);
        }}
        paymentMethod={screen.paymentMethod}
        preparedQuote={screen.preparedQuote}
        modeInfo={{
          mode: "fund_wallet",
        }}
      />
    );
  }

  if (screen.id === "5:execute") {
    return (
      <StepRunner
        // from props
        client={props.client}
        // others
        title={undefined}
        preparedQuote={screen.preparedQuote}
        autoStart={true}
        onBack={() => {
          setScreen({
            ...screen,
            id: "4:preview",
          });
        }}
        onCancel={() => {
          handleCancel(screen.preparedQuote);
        }}
        onComplete={(completedStatuses) => {
          if (
            screen.preparedQuote.type === "buy" ||
            screen.preparedQuote.type === "onramp"
          ) {
            props.onSuccess?.({
              quote: screen.preparedQuote,
              statuses: completedStatuses,
            });
          }
          setScreen({
            id: "6:success",
            preparedQuote: screen.preparedQuote,
            completedStatuses,
          });
        }}
        request={screen.request}
        wallet={screen.paymentMethod.payerWallet}
        windowAdapter={webWindowAdapter}
      />
    );
  }

  if (screen.id === "6:success") {
    return (
      <SuccessScreen
        // from props
        client={props.client}
        hasPaymentId={!!props.paymentLinkId}
        completedStatuses={screen.completedStatuses}
        // others
        onDone={() => {
          setScreen({ id: "1:buy-ui" });
        }}
        preparedQuote={screen.preparedQuote}
        showContinueWithTx={false}
        windowAdapter={webWindowAdapter}
      />
    );
  }

  if (screen.id === "error") {
    return (
      <ErrorBanner
        client={props.client}
        error={screen.error}
        onCancel={() => {
          setScreen({ id: "1:buy-ui" });
          handleCancel(screen.preparedQuote);
        }}
        onRetry={() => {
          setScreen({ id: "1:buy-ui" });
        }}
      />
    );
  }

  return null;
}

/**
 * @internal
 */
function BridgeWidgetContainer(props: {
  theme: BuyWidgetProps["theme"];
  className: string | undefined;
  style?: React.CSSProperties | undefined;
  children: React.ReactNode;
}) {
  return (
    <CustomThemeProvider theme={props.theme || "dark"}>
      <EmbedContainer
        className={props.className}
        modalSize="compact"
        style={props.style}
      >
        <DynamicHeight>{props.children}</DynamicHeight>
      </EmbedContainer>
    </CustomThemeProvider>
  );
}

/**
 * Connection options for the `BuyWidget` component
 *
 * @example
 * ```tsx
 * <BuyWidget client={client} connectOptions={{
 *    connectModal: {
 *      size: 'compact',
 *      title: "Sign in",
 *    }
 *  }}
 * />
 * ```
 */
type BuyWidgetConnectOptions = {
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
