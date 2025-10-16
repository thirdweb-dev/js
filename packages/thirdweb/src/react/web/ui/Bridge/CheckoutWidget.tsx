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
import { useConnectLocale } from "../ConnectWallet/locale/getConnectLocale.js";
import type { ConnectLocale } from "../ConnectWallet/locale/types.js";
import { EmbedContainer } from "../ConnectWallet/Modal/ConnectEmbed.js";
import { DynamicHeight } from "../components/DynamicHeight.js";
import { Spinner } from "../components/Spinner.js";
import type { LocaleId } from "../types.js";
import { useTokenQuery } from "./common/token-query.js";
import { DirectPayment } from "./DirectPayment.js";
import { ErrorBanner } from "./ErrorBanner.js";
import { PaymentDetails } from "./payment-details/PaymentDetails.js";
import { PaymentSelection } from "./payment-selection/PaymentSelection.js";
import { SuccessScreen } from "./payment-success/SuccessScreen.js";
import { QuoteLoader } from "./QuoteLoader.js";
import { StepRunner } from "./StepRunner.js";
import type { PaymentMethod } from "./types.js";
import { UnsupportedTokenScreen } from "./UnsupportedTokenScreen.js";

export type CheckoutWidgetProps = {
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
   * By default - ConnectButton UI uses the `en-US` locale for english language users.
   *
   * You can customize the language used in the ConnectButton UI by setting the `locale` prop.
   *
   * Refer to the [`LocaleId`](https://portal.thirdweb.com/references/typescript/v5/LocaleId) type for supported locales.
   */
  locale?: LocaleId;
  /**
   * Set the theme for the `CheckoutWidget` component. By default it is set to `"dark"`
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
   *  return <CheckoutWidget client={client} theme={customTheme} />
   * }
   * ```
   */
  theme?: "light" | "dark" | Theme;

  /**
   * Customize the options for "Connect" Button showing in the CheckoutWidget UI when the user is not connected to a wallet.
   *
   * Refer to the [`CheckoutWidgetConnectOptions`](https://portal.thirdweb.com/references/typescript/v5/CheckoutWidgetConnectOptions) type for more details.
   */
  connectOptions?: CheckoutWidgetConnectOptions;

  /**
   * All wallet IDs included in this array will be hidden from wallet selection when connected.
   */
  hiddenWallets?: WalletId[];

  /**
   * The wallet that should be pre-selected in the CheckoutWidget UI.
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
  chain: Chain;

  /**
   * Address of the token to accept as payment. Leave undefined for the native token, or use 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE.
   */
  tokenAddress?: Address;

  /**
   * The price of the item **(as a decimal string)**, e.g. "1.5" for 1.5 tokens.
   */
  amount: string;

  /**
   * The wallet address or ENS funds will be paid to.
   */
  seller: Address;

  /**
   * The product name.
   */
  name?: string;

  /**
   * The product description.
   */
  description?: string;

  /**
   * The product image URL.
   */
  image?: string;

  /**
   * Whether the user or the seller pays the protocol fees. Defaults to the user.
   */
  feePayer?: "user" | "seller";

  /**
   * Arbitrary data to be included in the returned status and webhook events.
   */
  purchaseData?: PurchaseData;

  /**
   * Callback triggered when the purchase is successful.
   */
  onSuccess?: (data: {
    quote: BridgePrepareResult;
    statuses: CompletedStatusResult[];
  }) => void;

  /**
   * Callback triggered when the purchase encounters an error.
   */
  onError?: (error: Error, quote: BridgePrepareResult | undefined) => void;

  /**
   * Callback triggered when the user cancels the purchase.
   */
  onCancel?: (quote: BridgePrepareResult | undefined) => void;

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
};

/**
 * Widget a prebuilt UI for purchasing a specific token.
 *
 * @param props - Props of type [`CheckoutWidgetProps`](https://portal.thirdweb.com/references/typescript/v5/CheckoutWidgetProps) to configure the CheckoutWidget component.
 *
 * @example
 * ### Default configuration
 *
 * The `CheckoutWidget` component allows user to pay a given wallet for any product or service. You can register webhooks to get notified for every purchase done via the widget.
 *
 * ```tsx
 * <CheckoutWidget
 *   client={client}
 *   chain={base}
 *   amount="0.01" // in native tokens (ETH), pass tokenAddress to charge in a specific token (USDC, USDT, etc.)
 *   seller="0x123...abc" // the wallet address that will receive the payment
 *   name="Premium Course"
 *   description="Complete guide to web3 development"
 *   image="/course-thumbnail.jpg"
 *   onSuccess={() => {
 *     alert("Purchase successful!");
 *   }}
 *  />
 * ```
 *
 * ### Customize the supported tokens
 *
 * You can customize the supported tokens that users can pay with by passing a `supportedTokens` object to the `CheckoutWidget` component.
 *
 * ```tsx
 * <CheckoutWidget
 *   client={client}
 *   chain={arbitrum}
 *   amount="0.01"
 *   seller="0x123...abc"
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
 *  />
 * ```
 *
 * ### Customize the UI
 *
 * You can customize the UI of the `CheckoutWidget` component by passing a custom theme object to the `theme` prop.
 *
 * ```tsx
 * <CheckoutWidget
 *   client={client}
 *   chain={arbitrum}
 *   amount="0.01"
 *   seller="0x123...abc"
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
 * You can update the title of the widget by passing a `title` prop to the `CheckoutWidget` component.
 *
 * ```tsx
 * <CheckoutWidget
 *   client={client}
 *   title="Checkout ETH"
 * />
 * ```
 *
 * ### Configure the wallet connection
 *
 * You can customize the wallet connection flow by passing a `connectOptions` object to the `CheckoutWidget` component.
 *
 * ```tsx
 * <CheckoutWidget
 *   client={client}
 *   chain={arbitrum}
 *   amount="0.01"
 *   seller="0x123...abc"
 *   connectOptions={{
 *     connectModal: {
 *       size: 'compact',
 *       title: "Sign in",
 *     }
 *   }}
 * />
 * ```
 *
 * Refer to the [`CheckoutWidgetConnectOptions`](https://portal.thirdweb.com/references/typescript/v5/CheckoutWidgetConnectOptions) type for more details.
 *
 * @bridge
 */
export function CheckoutWidget(props: CheckoutWidgetProps) {
  return (
    <CheckoutWidgetContainer
      theme={props.theme}
      className={props.className}
      style={props.style}
    >
      <CheckoutWidgetContentWrapper {...props} />
    </CheckoutWidgetContainer>
  );
}

function CheckoutWidgetContentWrapper(props: CheckoutWidgetProps) {
  const localQuery = useConnectLocale(props.locale || "en_US");
  const tokenQuery = useTokenQuery({
    tokenAddress: props.tokenAddress,
    chainId: props.chain.id,
    client: props.client,
  });

  useQuery({
    queryFn: () => {
      trackPayEvent({
        client: props.client,
        event: "ub:ui:checkout_widget:render",
        toChainId: props.chain.id,
        toToken: props.tokenAddress,
      });
      return true;
    },
    queryKey: ["checkout_widget:render"],
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

  if (tokenQuery.isPending || !localQuery.data) {
    return (
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
  } else if (tokenQuery.data?.type === "unsupported_token") {
    return (
      <UnsupportedTokenScreen
        chain={props.chain}
        client={props.client}
        tokenAddress={props.tokenAddress || NATIVE_TOKEN_ADDRESS}
      />
    );
  } else if (tokenQuery.data?.type === "success") {
    return (
      <CheckoutWidgetContent
        {...props}
        connectLocale={localQuery.data}
        destinationToken={tokenQuery.data.token}
        currency={props.currency || "USD"}
        paymentMethods={props.paymentMethods || ["crypto", "card"]}
        connectOptions={connectOptions}
        showThirdwebBranding={
          props.showThirdwebBranding === undefined
            ? true
            : props.showThirdwebBranding
        }
      />
    );
  } else if (tokenQuery.error) {
    return (
      <ErrorBanner
        client={props.client}
        error={tokenQuery.error}
        onRetry={() => {
          tokenQuery.refetch();
        }}
        onCancel={() => {
          props.onCancel?.(undefined);
        }}
      />
    );
  }

  return null;
}

type CheckoutWidgetScreen =
  | { id: "1:init-ui" }
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

type RequiredParams<T extends object, keys extends keyof T> = T & {
  [K in keys]-?: T[K];
};

function CheckoutWidgetContent(
  props: RequiredParams<
    CheckoutWidgetProps,
    "currency" | "showThirdwebBranding" | "paymentMethods"
  > & {
    connectLocale: ConnectLocale;
    destinationToken: TokenWithPrices;
  },
) {
  const [screen, setScreen] = useState<CheckoutWidgetScreen>({
    id: "1:init-ui",
  });

  const mappedFeePayer: "receiver" | "sender" =
    props.feePayer === "seller" ? "receiver" : "sender";

  const handleError = useCallback(
    (error: Error, quote: BridgePrepareResult | undefined) => {
      console.error(error);
      props.onError?.(error, quote);
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
      props.onCancel?.(preparedQuote);
    },
    [props.onCancel],
  );

  if (screen.id === "1:init-ui") {
    return (
      <DirectPayment
        // from props
        client={props.client}
        paymentInfo={{
          amount: props.amount,
          feePayer: props.feePayer === "seller" ? "receiver" : "sender",
          sellerAddress: props.seller,
          token: props.destinationToken,
        }}
        showThirdwebBranding={props.showThirdwebBranding}
        metadata={{
          title: props.name,
          description: props.description,
          image: props.image,
        }}
        currency={props.currency}
        buttonLabel={props.buttonLabel}
        // others
        onContinue={(destinationAmount, destinationToken, receiverAddress) => {
          setScreen({
            id: "2:methodSelection",
            destinationAmount,
            destinationToken,
            receiverAddress,
          });
        }}
      />
    );
  }

  if (screen.id === "2:methodSelection") {
    return (
      <PaymentSelection
        // from props
        client={props.client}
        feePayer={mappedFeePayer}
        connectLocale={props.connectLocale}
        connectOptions={props.connectOptions}
        paymentMethods={props.paymentMethods}
        currency={props.currency}
        supportedTokens={props.supportedTokens}
        country={props.country}
        // others
        destinationAmount={screen.destinationAmount}
        destinationToken={screen.destinationToken}
        receiverAddress={screen.receiverAddress}
        onBack={() => {
          setScreen({ id: "1:init-ui" });
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
        feePayer={mappedFeePayer}
        // others
        sender={undefined}
        mode="direct_payment"
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
          title: props.name,
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
          mode: "direct_payment",
          paymentInfo: {
            amount: screen.destinationAmount,
            feePayer: mappedFeePayer,
            sellerAddress: props.seller,
            token: screen.destinationToken,
          },
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
          props.onSuccess?.({
            quote: screen.preparedQuote,
            statuses: completedStatuses,
          });
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
          setScreen({ id: "1:init-ui" });
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
          setScreen({ id: "1:init-ui" });
          handleCancel(screen.preparedQuote);
        }}
        onRetry={() => {
          setScreen({ id: "1:init-ui" });
        }}
      />
    );
  }

  return null;
}

/**
 * @internal
 */
function CheckoutWidgetContainer(props: {
  theme: CheckoutWidgetProps["theme"];
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
 * Connection options for the `CheckoutWidget` component
 *
 * @example
 * ```tsx
 * <CheckoutWidget client={client} connectOptions={{
 *    connectModal: {
 *      size: 'compact',
 *      title: "Sign in",
 *    }
 *  }}
 * />
 * ```
 */
type CheckoutWidgetConnectOptions = {
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
