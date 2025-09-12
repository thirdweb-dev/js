"use client";

import { useMemo, useState } from "react";
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
import { useActiveAccount } from "../../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../../core/hooks/wallets/useActiveWallet.js";
import { useActiveWalletChain } from "../../../../core/hooks/wallets/useActiveWalletChain.js";
import { webWindowAdapter } from "../../../adapters/WindowAdapter.js";
import { useConnectLocale } from "../../ConnectWallet/locale/getConnectLocale.js";
import { EmbedContainer } from "../../ConnectWallet/Modal/ConnectEmbed.js";
import { DynamicHeight } from "../../components/DynamicHeight.js";
import { Spinner } from "../../components/Spinner.js";
import type { LocaleId } from "../../types.js";
import { PaymentDetails } from "../payment-details/PaymentDetails.js";
import { QuoteLoader } from "../QuoteLoader.js";
import { StepRunner } from "../StepRunner.js";
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
  | { id: "2:loading-quote"; quote: Buy.quote.Result | Sell.quote.Result }
  | {
      id: "3:preview";
      preparedQuote: BridgePrepareResult;
      request: BridgePrepareRequest;
      quote: Buy.quote.Result | Sell.quote.Result;
    }
  | {
      id: "4:execute";
      request: BridgePrepareRequest;
      quote: Buy.quote.Result | Sell.quote.Result;
      preparedQuote: BridgePrepareResult;
    };

function SwapWidgetContent(props: SwapWidgetProps) {
  const [screen, setScreen] = useState<SwapWidgetScreen>({ id: "1:swap-ui" });
  const connectLocaleQuery = useConnectLocale(props.locale || "en_US");
  const activeWalletInfo = useActiveWalletInfo();
  const [buyToken, setBuyToken] = useState<TokenWithPrices | undefined>(
    undefined,
  );
  const [sellToken, setSellToken] = useState<TokenWithPrices | undefined>(
    undefined,
  );

  // preload requests
  useBridgeChains(props.client);

  if (!connectLocaleQuery.data) {
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
  }

  if (screen.id === "1:swap-ui") {
    return (
      <SwapUI
        client={props.client}
        theme={props.theme || "dark"}
        buyToken={buyToken}
        sellToken={sellToken}
        setBuyToken={setBuyToken}
        setSellToken={setSellToken}
        connectOptions={props.connectOptions}
        currency={props.currency || "USD"}
        activeWalletInfo={activeWalletInfo}
        onSwap={(quote) => {
          setScreen({ quote, id: "2:loading-quote" });
        }}
      />
    );
  }

  if (
    screen.id === "2:loading-quote" &&
    // TODO - cleanup
    activeWalletInfo &&
    sellToken &&
    buyToken
  ) {
    return (
      <QuoteLoader
        amount={toTokens(screen.quote.destinationAmount, buyToken.decimals)}
        onError={() => {
          // TODO
        }}
        onQuoteReceived={(preparedQuote, request) => {
          setScreen({
            id: "3:preview",
            preparedQuote,
            request,
            quote: screen.quote,
          });
          // TODO
        }}
        receiver={activeWalletInfo.activeAccount.address}
        onBack={() => setScreen({ id: "1:swap-ui" })}
        uiOptions={{
          destinationToken: buyToken,
          mode: "fund_wallet",
          currency: props.currency,
        }}
        client={props.client}
        destinationToken={buyToken}
        paymentMethod={{
          quote: screen.quote,
          type: "wallet",
          payerWallet: activeWalletInfo.activeWallet,
          balance: 0n, // TODO - what is this?
          originToken: sellToken,
        }}
      />
    );
  }

  if (
    screen.id === "3:preview" &&
    // TODO - cleanup
    activeWalletInfo &&
    sellToken &&
    buyToken
  ) {
    return (
      <PaymentDetails
        client={props.client}
        onBack={() => {
          setScreen({ id: "1:swap-ui" });
        }}
        onConfirm={() => {
          setScreen({
            id: "4:execute",
            preparedQuote: screen.preparedQuote,
            request: screen.request,
            quote: screen.quote,
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
          originToken: sellToken,
        }}
        preparedQuote={screen.preparedQuote}
        uiOptions={{
          destinationToken: buyToken,
          mode: "fund_wallet",
          currency: props.currency,
        }}
      />
    );
  }

  if (
    screen.id === "4:execute" &&
    // TODO - cleanup
    activeWalletInfo
  ) {
    return (
      <StepRunner
        autoStart={true}
        client={props.client}
        onBack={() => {
          setScreen({
            id: "3:preview",
            preparedQuote: screen.preparedQuote,
            request: screen.request,
            quote: screen.quote,
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

function useActiveWalletInfo() {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const activeChain = useActiveWalletChain();

  return useMemo(() => {
    return activeAccount && activeWallet && activeChain
      ? {
          activeChain,
          activeWallet,
          activeAccount,
        }
      : undefined;
  }, [activeAccount, activeWallet, activeChain]);
}
