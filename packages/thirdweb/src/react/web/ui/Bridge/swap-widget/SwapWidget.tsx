"use client";

import { useCallback, useEffect, useState } from "react";
import { getAddress } from "thirdweb/utils";
import type { Buy, Sell } from "../../../../../bridge/index.js";
import type { TokenWithPrices } from "../../../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import type { SupportedFiatCurrency } from "../../../../../pay/convert/type.js";
import { CustomThemeProvider } from "../../../../core/design-system/CustomThemeProvider.js";
import type { Theme } from "../../../../core/design-system/index.js";
import type {
  BridgePrepareRequest,
  BridgePrepareResult,
} from "../../../../core/hooks/useBridgePrepare.js";
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
import type { SwapWidgetConnectOptions, TokenSelection } from "./types.js";
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
  className?: string;
  /**
   * The currency to use for the payment.
   * @default "USD"
   */
  currency?: SupportedFiatCurrency;
  style?: React.CSSProperties;
  /**
   * Whether to show thirdweb branding in the widget.
   * @default true
   */
  showThirdwebBranding?: boolean;
  /**
   * Callback to be called when the swap is successful.
   */
  onSuccess?: () => void;
  /**
   * Callback to be called when user encounters an error when swapping.
   */
  onError?: (error: Error) => void;
  /**
   * Callback to be called when the user cancels the purchase.
   */
  onCancel?: () => void;
  connectOptions?: SwapWidgetConnectOptions;
  /**
   * The prefill Buy and/or Sell tokens for the swap widget. If `tokenAddress` is not provided, the native token will be used
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
};

export function SwapWidget(props: SwapWidgetProps) {
  return (
    <SwapWidgetContainer
      theme={props.theme}
      style={props.style}
      className={props.className}
    >
      <SwapWidgetContent {...props} />
    </SwapWidgetContainer>
  );
}

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

type SwapWidgetScreen =
  | { id: "1:swap-ui" }
  | {
      id: "2:loading-quote";
      quote: Buy.quote.Result | Sell.quote.Result;
      buyToken: TokenWithPrices;
      sellToken: TokenWithPrices;
      sellTokenBalance: bigint;
      mode: "buy" | "sell";
    }
  | {
      id: "2:preview";
      preparedQuote: Extract<BridgePrepareResult, { type: "buy" | "sell" }>;
      request: BridgePrepareRequest;
      quote: Buy.quote.Result | Sell.quote.Result;
      buyToken: TokenWithPrices;
      sellToken: TokenWithPrices;
      sellTokenBalance: bigint;
      mode: "buy" | "sell";
    }
  | {
      id: "3:execute";
      request: BridgePrepareRequest;
      quote: Buy.quote.Result | Sell.quote.Result;
      preparedQuote: Extract<BridgePrepareResult, { type: "buy" | "sell" }>;
      buyToken: TokenWithPrices;
      sellToken: TokenWithPrices;
      sellTokenBalance: bigint;
      mode: "buy" | "sell";
    }
  | {
      id: "4:success";
      completedStatuses: CompletedStatusResult[];
      preparedQuote: Extract<BridgePrepareResult, { type: "buy" | "sell" }>;
      buyToken: TokenWithPrices;
      sellToken: TokenWithPrices;
    }
  | {
      id: "error";
      error: Error;
    };

function SwapWidgetContent(props: SwapWidgetProps) {
  const [screen, setScreen] = useState<SwapWidgetScreen>({ id: "1:swap-ui" });
  const activeWalletInfo = useActiveWalletInfo();

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
    if (props.prefill?.buyToken) {
      return {
        tokenAddress:
          props.prefill.buyToken.tokenAddress ||
          getAddress(NATIVE_TOKEN_ADDRESS),
        chainId: props.prefill.buyToken.chainId,
      };
    }
    const last = getLastUsedTokens()?.buyToken;
    if (last) {
      return {
        tokenAddress: getAddress(last.tokenAddress),
        chainId: last.chainId,
      };
    }
    return undefined;
  });
  const [sellToken, setSellToken] = useState<TokenSelection | undefined>(() => {
    if (props.prefill?.sellToken) {
      return {
        tokenAddress:
          props.prefill.sellToken.tokenAddress ||
          getAddress(NATIVE_TOKEN_ADDRESS),
        chainId: props.prefill.sellToken.chainId,
      };
    }
    const last = getLastUsedTokens()?.sellToken;
    if (last) {
      return {
        tokenAddress: getAddress(last.tokenAddress),
        chainId: last.chainId,
      };
    }
    return undefined;
  });

  // persist selections to localStorage whenever they change
  useEffect(() => {
    if (buyToken) {
      setLastUsedTokens({ buyToken, sellToken });
    }
  }, [buyToken, sellToken]);

  // preload requests
  useBridgeChains(props.client);

  const handleError = useCallback(
    (error: Error) => {
      console.error(error);
      props.onError?.(error);
      setScreen({
        id: "error",
        error,
      });
    },
    [props.onError],
  );

  // if wallet suddenly disconnects, show screen 1
  if (screen.id === "1:swap-ui" || !activeWalletInfo) {
    return (
      <SwapUI
        showThirdwebBranding={
          props.showThirdwebBranding === undefined
            ? true
            : props.showThirdwebBranding
        }
        client={props.client}
        theme={props.theme || "dark"}
        connectOptions={props.connectOptions}
        currency={props.currency || "USD"}
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
        onError={handleError}
        paymentMethod={{
          quote: screen.quote,
          type: "wallet",
          payerWallet: activeWalletInfo.activeWallet,
          balance: screen.sellTokenBalance,
          originToken: screen.sellToken,
          action: screen.mode,
        }}
        preparedQuote={screen.preparedQuote}
        uiOptions={{
          destinationToken: screen.buyToken,
          mode: "fund_wallet",
          currency: props.currency,
        }}
      />
    );
  }

  if (screen.id === "3:execute") {
    return (
      <StepRunner
        autoStart={true}
        client={props.client}
        onBack={() => {
          setScreen({
            ...screen,
            id: "2:preview",
            sellTokenBalance: screen.sellTokenBalance,
          });
        }}
        onCancel={props.onCancel}
        onComplete={(completedStatuses) => {
          props.onSuccess?.();
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
        uiOptions={{
          destinationToken: screen.buyToken,
          mode: "fund_wallet",
          currency: props.currency,
        }}
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
          props.onCancel?.();
        }}
        onRetry={() => {
          setScreen({ id: "1:swap-ui" });
        }}
      />
    );
  }

  return null;
}
