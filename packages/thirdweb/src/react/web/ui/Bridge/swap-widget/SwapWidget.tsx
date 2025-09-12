"use client";

import { useState } from "react";
import type { Buy, Sell } from "../../../../../bridge/index.js";
import type { TokenWithPrices } from "../../../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { SupportedFiatCurrency } from "../../../../../pay/convert/type.js";
import { toTokens } from "../../../../../utils/units.js";
import { CustomThemeProvider } from "../../../../core/design-system/CustomThemeProvider.js";
import type { Theme } from "../../../../core/design-system/index.js";
import type {
  BridgePrepareRequest,
  BridgePrepareResult,
} from "../../../../core/hooks/useBridgePrepare.js";
import { webWindowAdapter } from "../../../adapters/WindowAdapter.js";
import { EmbedContainer } from "../../ConnectWallet/Modal/ConnectEmbed.js";
import { DynamicHeight } from "../../components/DynamicHeight.js";
import type { LocaleId } from "../../types.js";
import { PaymentDetails } from "../payment-details/PaymentDetails.js";
import { QuoteLoader } from "../QuoteLoader.js";
import { StepRunner } from "../StepRunner.js";
import { useActiveWalletInfo } from "./hooks.js";
import { SwapUI } from "./swap-ui.js";
import type { SwapWidgetConnectOptions } from "./types.js";
import { useBridgeChains } from "./use-bridge-chains.js";

type SwapWidgetProps = {
  client: ThirdwebClient;
  theme?: "light" | "dark" | Theme;
  className?: string;
  locale?: LocaleId;
  currency?: SupportedFiatCurrency;
  style?: React.CSSProperties;
  showThirdwebBranding?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  connectOptions?: SwapWidgetConnectOptions;
};

export function SwapWidget(props: SwapWidgetProps) {
  return (
    <SwapWidgetContainer
      theme={props.theme}
      style={props.style}
      className={props.className}
    >
      <SwapWidgetContent
        client={props.client}
        theme={props.theme}
        connectOptions={props.connectOptions}
        locale={props.locale}
        currency={props.currency}
        style={props.style}
        showThirdwebBranding={props.showThirdwebBranding}
      />
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
    }
  | {
      id: "3:preview";
      preparedQuote: BridgePrepareResult;
      request: BridgePrepareRequest;
      quote: Buy.quote.Result | Sell.quote.Result;
      buyToken: TokenWithPrices;
      sellToken: TokenWithPrices;
    }
  | {
      id: "4:execute";
      request: BridgePrepareRequest;
      quote: Buy.quote.Result | Sell.quote.Result;
      preparedQuote: BridgePrepareResult;
      buyToken: TokenWithPrices;
      sellToken: TokenWithPrices;
    };

function SwapWidgetContent(props: SwapWidgetProps) {
  const [screen, setScreen] = useState<SwapWidgetScreen>({ id: "1:swap-ui" });
  const activeWalletInfo = useActiveWalletInfo();

  // preload requests
  useBridgeChains(props.client);

  // if wallet suddenly disconnects, show screen 1
  if (screen.id === "1:swap-ui" || !activeWalletInfo) {
    return (
      <SwapUI
        client={props.client}
        theme={props.theme || "dark"}
        connectOptions={props.connectOptions}
        currency={props.currency || "USD"}
        activeWalletInfo={activeWalletInfo}
        onSwap={(quote, selection) => {
          setScreen({
            quote,
            id: "2:loading-quote",
            ...selection,
          });
        }}
      />
    );
  }

  if (screen.id === "2:loading-quote") {
    return (
      <QuoteLoader
        amount={toTokens(
          screen.quote.destinationAmount,
          screen.buyToken.decimals,
        )}
        onError={() => {
          // TODO
        }}
        onQuoteReceived={(preparedQuote, request) => {
          setScreen({
            ...screen,
            id: "3:preview",
            preparedQuote,
            request,
          });
          // TODO
        }}
        receiver={activeWalletInfo.activeAccount.address}
        onBack={() => setScreen({ id: "1:swap-ui" })}
        uiOptions={{
          destinationToken: screen.buyToken,
          mode: "fund_wallet",
          currency: props.currency,
        }}
        client={props.client}
        destinationToken={screen.buyToken}
        paymentMethod={{
          quote: screen.quote,
          type: "wallet",
          payerWallet: activeWalletInfo.activeWallet,
          balance: 0n, // TODO - what is this?
          originToken: screen.sellToken,
        }}
      />
    );
  }

  if (screen.id === "3:preview") {
    return (
      <PaymentDetails
        client={props.client}
        onBack={() => {
          setScreen({ id: "1:swap-ui" });
        }}
        onConfirm={() => {
          setScreen({
            ...screen,
            id: "4:execute",
          });
        }}
        onError={(_error) => {
          // TODO
        }}
        paymentMethod={{
          quote: screen.quote,
          type: "wallet",
          payerWallet: activeWalletInfo.activeWallet,
          balance: 0n, // TODO - what is this?
          originToken: screen.sellToken,
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

  if (screen.id === "4:execute") {
    return (
      <StepRunner
        autoStart={true}
        client={props.client}
        onBack={() => {
          setScreen({
            ...screen,
            id: "3:preview",
          });
        }}
        onCancel={() => {
          // TODO
        }}
        onComplete={() => {
          // TODO
        }}
        request={screen.request}
        wallet={activeWalletInfo.activeWallet}
        windowAdapter={webWindowAdapter}
      />
    );
  }

  return null;
}
