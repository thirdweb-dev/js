"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { trackPayEvent } from "../../../../../analytics/track/pay.js";
import type { Buy, Sell } from "../../../../../bridge/index.js";
import type { TokenWithPrices } from "../../../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import type { SupportedFiatCurrency } from "../../../../../pay/convert/type.js";
import { getAddress } from "../../../../../utils/address.js";
import { CustomThemeProvider } from "../../../../core/design-system/CustomThemeProvider.js";
import type { Theme } from "../../../../core/design-system/index.js";
import type { BridgePrepareRequest } from "../../../../core/hooks/useBridgePrepare.js";
import type { CompletedStatusResult } from "../../../../core/hooks/useStepExecutor.js";
import { webWindowAdapter } from "../../../adapters/WindowAdapter.js";
import { EmbedContainer } from "../../ConnectWallet/Modal/ConnectEmbed.js";
import { DynamicHeight } from "../../components/DynamicHeight.js";
import { ErrorBanner } from "../ErrorBanner.js";
import { PaymentDetails } from "../payment-details/PaymentDetails.js";
import { SuccessScreen } from "../payment-success/SuccessScreen.js";
import { StepRunner } from "../StepRunner.js";
import { useActiveWalletInfo } from "./hooks.js";
import { getLastUsedTokens, setLastUsedTokens } from "./storage.js";
import { SwapUI } from "./swap-ui.js";
import type {
  SwapPreparedQuote,
  SwapWidgetConnectOptions,
  TokenSelection,
} from "./types.js";
import { useBridgeChains } from "./use-bridge-chains.js";

export type SwapWidgetProps = {
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
   * Prefill Buy and/or Sell tokens for the swap widget. If `tokenAddress` is not provided, the native token will be used
   *
   * @example
   *
   * ### Set an ERC20 token as the buy token
   * ```ts
   * <SwapWidget client={client} prefill={{
   *  buyToken: {
   *    chainId: 8453,
   *    tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
   *  },
   * }} />
   * ```
   *
   * ### Set a native token as the sell token
   *
   * ```ts
   * <SwapWidget client={client} prefill={{
   *  sellToken: {
   *    chainId: 8453,
   *  },
   * }} />
   * ```
   *
   * ### Set 0.1 Base USDC as the buy token
   * ```ts
   * <SwapWidget client={client} prefill={{
   *  buyToken: {
   *    chainId: 8453,
   *    amount: "0.1",
   *    tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
   *  },
   * }} />
   * ```
   *
   * ### Set Base USDC as the buy token and Base native token as the sell token
   * ```ts
   * <SwapWidget client={client} prefill={{
   *  buyToken: {
   *    chainId: 8453,
   *    tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
   *  },
   *  sellToken: {
   *    chainId: 8453,
   *  },
   * }} />
   * ```
   */
  prefill?: {
    buyToken?: {
      tokenAddress?: string;
      chainId: number;
      amount?: string;
    };
    sellToken?: {
      tokenAddress?: string;
      chainId: number;
      amount?: string;
    };
  };
  /**
   * Set the theme for the `SwapWidget` component. By default it is set to `"dark"`
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
   *  return <SwapWidget client={client} theme={customTheme} />
   * }
   * ```
   */
  theme?: "light" | "dark" | Theme;
  /**
   * The currency to use for the payment.
   * @default "USD"
   */
  currency?: SupportedFiatCurrency;
  connectOptions?: SwapWidgetConnectOptions;
  /**
   * Whether to show thirdweb branding in the widget.
   * @default true
   */
  showThirdwebBranding?: boolean;
  /**
   * Callback to be called when the swap is successful.
   */
  onSuccess?: (data: {
    quote: SwapPreparedQuote;
    statuses: CompletedStatusResult[];
  }) => void;
  /**
   * Callback to be called when user encounters an error when swapping.
   */
  onError?: (error: Error, quote: SwapPreparedQuote) => void;
  /**
   * Callback to be called when the user cancels the purchase.
   */
  onCancel?: (quote: SwapPreparedQuote) => void;
  style?: React.CSSProperties;
  className?: string;

  /**
   * Whether to persist the token selections to localStorage so that if the user revisits the widget, the last used tokens are pre-selected.
   * The last used tokens do not override the tokens specified in the `prefill` prop
   *
   * @default true
   */
  persistTokenSelections?: boolean;
  /**
   * Called when the user disconnects the active wallet
   */
  onDisconnect?: () => void;
};

/**
 * A widget for swapping tokens with cross-chain support
 *
 * @param props - Props of type [`SwapWidgetProps`](https://portal.thirdweb.com/references/typescript/v5/SwapWidgetProps) to configure the SwapWidget component.
 *
 * @example
 * ### Basic usage
 *
 * By default, no tokens are selected in the widget UI.
 *
 * You can set specific tokens to buy or sell by default by passing the `prefill` prop. User can change these selections in the widget UI.
 *
 * ```tsx
 * <SwapWidget client={client} />
 * ```
 *
 * ### Set an ERC20 token to Buy by default
 *
 * ```tsx
 * <SwapWidget client={client} prefill={{
 *  buyToken: {
 *    // Base USDC
 *    chainId: 8453,
 *    tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
 *  },
 * }} />
 * ```
 *
 * ### Set a native token to Sell by default
 *
 * By not specifying a `tokenAddress`, the native token will be used.
 *
 * ```tsx
 * <SwapWidget client={client} prefill={{
 *  // Base native token (ETH)
 *  sellToken: {
 *    chainId: 8453,
 *  },
 * }} />
 * ```
 *
 * ### Set amount and token to Buy by default
 *
 * ```tsx
 * <SwapWidget client={client} prefill={{
 *  buyToken: {
 *    // 0.1 Base USDC
 *    chainId: 8453,
 *    amount: "0.1",
 *    tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
 *  },
 * }} />
 * ```
 *
 * ### Set both buy and sell tokens by default
 *
 * ```tsx
 * <SwapWidget client={client} prefill={{
 *  buyToken: {
 *    // Base USDC
 *    chainId: 8453,
 *    tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
 *  },
 *  sellToken: {
 *    // Polygon native token (MATIC)
 *    chainId: 137,
 *  },
 * }} />
 * ```
 *
 * @bridge
 */
export function SwapWidget(props: SwapWidgetProps) {
  useQuery({
    queryFn: () => {
      trackPayEvent({
        client: props.client,
        event: "ub:ui:swap_widget:render",
      });
      return true;
    },
    queryKey: ["swap_widget:render"],
  });

  return (
    <SwapWidgetContainer
      theme={props.theme}
      style={props.style}
      className={props.className}
    >
      <SwapWidgetContent {...props} currency={props.currency || "USD"} />
    </SwapWidgetContainer>
  );
}

/**
 * @internal
 */
export function SwapWidgetContainer(props: {
  theme: SwapWidgetProps["theme"];
  className: string | undefined;
  style?: React.CSSProperties | undefined;
  children: React.ReactNode;
}) {
  return (
    <CustomThemeProvider theme={props.theme || "dark"}>
      <EmbedContainer
        className={props.className}
        modalSize="compact"
        style={{
          ...props.style,
        }}
      >
        <DynamicHeight>{props.children}</DynamicHeight>
      </EmbedContainer>
    </CustomThemeProvider>
  );
}

type SelectionInfo = {
  preparedQuote: SwapPreparedQuote;
  request: BridgePrepareRequest;
  quote: Buy.quote.Result | Sell.quote.Result;
  buyToken: TokenWithPrices;
  sellToken: TokenWithPrices;
  sellTokenBalance: bigint;
  mode: "buy" | "sell";
};

type Join<T, U> = T & U;

type SwapWidgetScreen =
  | { id: "1:swap-ui" }
  | Join<{ id: "2:preview" }, SelectionInfo>
  | Join<{ id: "3:execute" }, SelectionInfo>
  | Join<
      {
        id: "4:success";
        completedStatuses: CompletedStatusResult[];
      },
      SelectionInfo
    >
  | { id: "error"; error: Error; preparedQuote: SwapPreparedQuote };

function SwapWidgetContent(
  props: SwapWidgetProps & {
    currency: SupportedFiatCurrency;
  },
) {
  const [screen, setScreen] = useState<SwapWidgetScreen>({ id: "1:swap-ui" });
  const activeWalletInfo = useActiveWalletInfo();
  const isPersistEnabled = props.persistTokenSelections !== false;

  const [amountSelection, setAmountSelection] = useState<{
    type: "buy" | "sell";
    amount: string;
  }>(() => {
    if (props.prefill?.buyToken?.amount) {
      return {
        type: "buy",
        amount: props.prefill.buyToken.amount,
      };
    }
    if (props.prefill?.sellToken?.amount) {
      return {
        type: "sell",
        amount: props.prefill.sellToken.amount,
      };
    }
    return {
      type: "buy",
      amount: "",
    };
  });

  const [buyToken, setBuyToken] = useState<TokenSelection | undefined>(() => {
    return getInitialTokens(props.prefill, isPersistEnabled).buyToken;
  });

  const [sellToken, setSellToken] = useState<TokenSelection | undefined>(() => {
    return getInitialTokens(props.prefill, isPersistEnabled).sellToken;
  });

  // persist selections to localStorage whenever they change
  useEffect(() => {
    if (isPersistEnabled) {
      setLastUsedTokens({ buyToken, sellToken });
    }
  }, [buyToken, sellToken, isPersistEnabled]);

  // preload requests
  useBridgeChains(props.client);

  const handleError = useCallback(
    (error: Error, quote: SwapPreparedQuote) => {
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

  // if wallet suddenly disconnects, show screen 1
  if (screen.id === "1:swap-ui" || !activeWalletInfo) {
    return (
      <SwapUI
        onDisconnect={props.onDisconnect}
        showThirdwebBranding={
          props.showThirdwebBranding === undefined
            ? true
            : props.showThirdwebBranding
        }
        client={props.client}
        theme={props.theme || "dark"}
        connectOptions={props.connectOptions}
        currency={props.currency}
        activeWalletInfo={activeWalletInfo}
        buyToken={buyToken}
        sellToken={sellToken}
        setBuyToken={setBuyToken}
        setSellToken={setSellToken}
        amountSelection={amountSelection}
        setAmountSelection={setAmountSelection}
        onSwap={(data) => {
          setScreen({
            id: "2:preview",
            buyToken: data.buyToken,
            sellToken: data.sellToken,
            sellTokenBalance: data.sellTokenBalance,
            mode: data.mode,
            preparedQuote: data.result,
            request: data.request,
            quote: data.result,
          });
        }}
      />
    );
  }

  if (screen.id === "2:preview") {
    return (
      <PaymentDetails
        metadata={{
          title: "Review Swap",
          description: undefined,
        }}
        confirmButtonLabel="Swap"
        client={props.client}
        onBack={() => {
          setScreen({ id: "1:swap-ui" });
        }}
        onConfirm={() => {
          setScreen({
            ...screen,
            id: "3:execute",
          });
        }}
        onError={(error) => handleError(error, screen.preparedQuote)}
        paymentMethod={{
          quote: screen.quote,
          type: "wallet",
          payerWallet: activeWalletInfo.activeWallet,
          balance: screen.sellTokenBalance,
          originToken: screen.sellToken,
          action: screen.mode,
        }}
        preparedQuote={screen.preparedQuote}
        currency={props.currency}
        modeInfo={{
          mode: "fund_wallet",
        }}
      />
    );
  }

  if (screen.id === "3:execute") {
    return (
      <StepRunner
        title="Processing Swap"
        autoStart={true}
        preparedQuote={screen.preparedQuote}
        client={props.client}
        onBack={() => {
          setScreen({
            ...screen,
            id: "2:preview",
            sellTokenBalance: screen.sellTokenBalance,
          });
        }}
        onCancel={() => props.onCancel?.(screen.preparedQuote)}
        onComplete={(completedStatuses) => {
          props.onSuccess?.({
            quote: screen.preparedQuote,
            statuses: completedStatuses,
          });
          setScreen({
            ...screen,
            id: "4:success",
            completedStatuses,
          });
        }}
        request={screen.request}
        wallet={activeWalletInfo.activeWallet}
        windowAdapter={webWindowAdapter}
      />
    );
  }

  if (screen.id === "4:success") {
    return (
      <SuccessScreen
        client={props.client}
        completedStatuses={screen.completedStatuses}
        onDone={() => {
          setScreen({ id: "1:swap-ui" });
          // clear amounts
          setAmountSelection({
            type: "buy",
            amount: "",
          });
        }}
        preparedQuote={screen.preparedQuote}
        showContinueWithTx={false}
        windowAdapter={webWindowAdapter}
        hasPaymentId={false} // TODO Question: Do we need to expose this as prop?
      />
    );
  }

  if (screen.id === "error") {
    return (
      <ErrorBanner
        client={props.client}
        error={screen.error}
        onCancel={() => {
          setScreen({ id: "1:swap-ui" });
          props.onCancel?.(screen.preparedQuote);
        }}
        onRetry={() => {
          setScreen({ id: "1:swap-ui" });
        }}
      />
    );
  }

  return null;
}

function getInitialTokens(
  prefill: SwapWidgetProps["prefill"],
  isPersistEnabled: boolean,
): {
  buyToken: TokenSelection | undefined;
  sellToken: TokenSelection | undefined;
} {
  const lastUsedTokens = isPersistEnabled ? getLastUsedTokens() : undefined;
  const buyToken = prefill?.buyToken
    ? {
        tokenAddress:
          prefill.buyToken.tokenAddress || getAddress(NATIVE_TOKEN_ADDRESS),
        chainId: prefill.buyToken.chainId,
      }
    : lastUsedTokens?.buyToken;

  const sellToken = prefill?.sellToken
    ? {
        tokenAddress:
          prefill.sellToken.tokenAddress || getAddress(NATIVE_TOKEN_ADDRESS),
        chainId: prefill.sellToken.chainId,
      }
    : lastUsedTokens?.sellToken;

  // if both tokens are same
  if (
    buyToken &&
    sellToken &&
    buyToken.tokenAddress?.toLowerCase() ===
      sellToken.tokenAddress?.toLowerCase() &&
    buyToken.chainId === sellToken.chainId
  ) {
    // if sell token prefill is specified, ignore buy token
    if (prefill?.sellToken) {
      return {
        buyToken: undefined,
        sellToken: sellToken,
      };
    }

    // if buy token prefill is specified, ignore sell token
    if (prefill?.buyToken) {
      return {
        buyToken: buyToken,
        sellToken: undefined,
      };
    }

    // if none of the two are specified via prefill, keep buy token
    return {
      buyToken: buyToken,
      sellToken: undefined,
    };
  }

  return {
    buyToken: buyToken,
    sellToken: sellToken,
  };
}
