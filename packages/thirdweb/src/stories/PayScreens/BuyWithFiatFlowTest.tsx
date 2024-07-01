import { useQuery } from "@tanstack/react-query";
import { FiatScreenMainUI } from "../../react/web/ui/ConnectWallet/screens/Buy/fiat/FiatScreenMain.js";
import { OnrampStatusScreenUI } from "../../react/web/ui/ConnectWallet/screens/Buy/fiat/FiatStatusScreen.js";
import {
  FiatSteps,
  fiatQuoteToPartialQuote,
} from "../../react/web/ui/ConnectWallet/screens/Buy/fiat/FiatSteps.js";
import {
  GettingPostOnRampQuote,
  PostOnrampQuoteFailed,
} from "../../react/web/ui/ConnectWallet/screens/Buy/fiat/PostOnRampSwap.js";
import { BuyUIMainScreen } from "../../react/web/ui/ConnectWallet/screens/Buy/main/BuyUIMainScreen.js";
import { PaymentMethodSelectionScreen } from "../../react/web/ui/ConnectWallet/screens/Buy/main/PaymentMethodSelection.js";
import { SwapFlow } from "../../react/web/ui/ConnectWallet/screens/Buy/swap/SwapFlow.js";
import type { SupportedChainAndTokens } from "../../react/web/ui/ConnectWallet/screens/Buy/swap/useSwapSupportedChains.js";
import {
  Row,
  StoryScreenTitle,
  noop,
  storyAccount,
  storyClient,
  storyWallet,
} from "../utils.js";
import { ScreenContainer } from "./ScreenContainer.js";
import type { BuyWithFiatMocks } from "./mockQuotes.js";

export function BuyWithFiatFlowTest(props: {
  mocks: BuyWithFiatMocks;
  theme: "dark" | "light";
  supportedDestinations: SupportedChainAndTokens;
}) {
  const fiatQuoteQuery = useQuery({
    queryKey: ["fiat.quote", props.mocks.meta],
    queryFn: () => props.mocks.quote,
  });

  const statusPendingQuery = useQuery({
    queryKey: ["fiat.status.pending", props.mocks.meta],
    queryFn: () => props.mocks.onrampStatus.pending,
  });

  const statusNoneQuery = useQuery({
    queryKey: ["fiat.status.none", props.mocks.meta],
    queryFn: () => props.mocks.onrampStatus.none,
  });

  const statusCompletedQuery = useQuery({
    queryKey: ["fiat.status.success", props.mocks.meta],
    queryFn: () => {
      if (props.mocks.type === "onramponly") {
        return props.mocks.onrampStatus.success;
      }

      throw new Error("invalid");
    },
  });

  const statusFailedQuery = useQuery({
    queryKey: ["fiat.status.failed", props.mocks.meta],
    queryFn: () => {
      if (props.mocks.type === "onramponly") {
        return props.mocks.onrampStatus.failed;
      }

      throw new Error("invalid");
    },
  });

  return (
    <div>
      <StoryScreenTitle label={props.mocks.meta.label} large />

      <ScreenContainer
        theme={props.theme}
        label="Initial Screen: No amount, chain selected"
      >
        <BuyUIMainScreen
          account={null}
          buyForTx={null}
          client={storyClient}
          onSelectBuyToken={noop}
          onViewPendingTx={noop}
          payOptions={{}}
          setScreen={noop}
          setTokenAmount={noop}
          supportedDestinations={props.supportedDestinations}
          toChain={props.mocks.meta.buyChain}
          toToken={props.mocks.meta.buyToken}
          tokenAmount=""
        />
      </ScreenContainer>

      <ScreenContainer
        theme={props.theme}
        label="Initial Screen: Amount entered"
      >
        <BuyUIMainScreen
          account={null}
          buyForTx={null}
          client={storyClient}
          onSelectBuyToken={noop}
          onViewPendingTx={noop}
          payOptions={{}}
          setScreen={noop}
          setTokenAmount={noop}
          supportedDestinations={props.supportedDestinations}
          toChain={props.mocks.meta.buyChain}
          toToken={props.mocks.meta.buyToken}
          tokenAmount={props.mocks.meta.buyTokenAmount}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Payment method selection">
        <PaymentMethodSelectionScreen
          client={storyClient}
          onBack={noop}
          selectedChain={props.mocks.meta.buyChain}
          selectedToken={props.mocks.meta.buyToken}
          setScreen={noop}
          tokenAmount={props.mocks.meta.buyTokenAmount}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Fiat Main screen">
        <FiatScreenMainUI
          client={storyClient}
          onBack={noop}
          // wallet on same chain as buy chain
          buyForTx={null}
          isEmbed={true}
          onDone={noop}
          onViewPendingTx={noop}
          payOptions={{}}
          setDrawerScreen={noop}
          setScreen={noop}
          toChain={props.mocks.meta.buyChain}
          toToken={props.mocks.meta.buyToken}
          tokenAmount={props.mocks.meta.buyTokenAmount}
          quoteQuery={fiatQuoteQuery}
          selectedCurrency={props.mocks.meta.currency}
          showCurrencySelector={noop}
          theme={props.theme}
          activeChain={props.mocks.meta.buyChain}
          activeWallet={storyWallet}
          account={storyAccount}
        />
      </ScreenContainer>

      {props.mocks.type === "onrampandswap" && (
        <ScreenContainer theme={props.theme} label="Two steps ui">
          <FiatSteps
            client={storyClient}
            onBack={noop}
            onContinue={noop}
            partialQuote={fiatQuoteToPartialQuote(props.mocks.quote)}
            step={1}
          />
        </ScreenContainer>
      )}

      <Row>
        <ScreenContainer theme={props.theme} label="Onramp status: none">
          <OnrampStatusScreenUI
            client={storyClient}
            statusQuery={statusPendingQuery}
            onDone={noop}
            onBack={noop}
            isBuyForTx={false}
            isEmbed={false}
            quote={props.mocks.quote}
            hasTwoSteps={false}
            onShowSwapFlow={noop}
            openedWindow={null}
          />
        </ScreenContainer>

        <ScreenContainer theme={props.theme} label="Onramp status: pending">
          <OnrampStatusScreenUI
            client={storyClient}
            statusQuery={statusNoneQuery}
            onDone={noop}
            onBack={noop}
            isBuyForTx={false}
            isEmbed={false}
            quote={props.mocks.quote}
            hasTwoSteps={false}
            onShowSwapFlow={noop}
            openedWindow={null}
          />
        </ScreenContainer>
      </Row>

      {props.mocks.type === "onramponly" && (
        <>
          <Row>
            <ScreenContainer theme={props.theme} label="Onramp status: success">
              <OnrampStatusScreenUI
                client={storyClient}
                statusQuery={statusCompletedQuery}
                onDone={noop}
                onBack={noop}
                isBuyForTx={false}
                isEmbed={false}
                quote={props.mocks.quote}
                hasTwoSteps={false}
                onShowSwapFlow={noop}
                openedWindow={null}
              />
            </ScreenContainer>

            <ScreenContainer theme={props.theme} label="Onramp status: failed">
              <OnrampStatusScreenUI
                client={storyClient}
                statusQuery={statusFailedQuery}
                onDone={noop}
                onBack={noop}
                isBuyForTx={false}
                isEmbed={false}
                quote={props.mocks.quote}
                hasTwoSteps={false}
                onShowSwapFlow={noop}
                openedWindow={null}
              />
            </ScreenContainer>
          </Row>
        </>
      )}

      {props.mocks.type === "onrampandswap" && (
        <>
          <ScreenContainer
            theme={props.theme}
            label="Onramp completed, swap required"
          >
            <FiatSteps
              client={storyClient}
              onBack={noop}
              onContinue={noop}
              partialQuote={fiatQuoteToPartialQuote(props.mocks.quote)}
              step={2}
              status={props.mocks.onrampStatus.swapRequired}
            />
          </ScreenContainer>

          <div>
            <Row>
              <ScreenContainer
                theme={props.theme}
                label="Getting Post onramp quote"
              >
                <GettingPostOnRampQuote onBack={noop} />
              </ScreenContainer>

              <ScreenContainer
                theme={props.theme}
                label="Failed to get post onramp quote"
              >
                <PostOnrampQuoteFailed onBack={noop} onRetry={noop} />
              </ScreenContainer>
            </Row>
          </div>

          <ScreenContainer theme={props.theme} label="Swap Flow">
            <SwapFlow
              isEmbed={true}
              account={storyAccount}
              buyWithCryptoQuote={props.mocks.postOnrampSwap.quote}
              client={storyClient}
              onDone={noop}
              onTryAgain={noop}
              onBack={noop}
              activeChain={props.mocks.meta.buyChain}
              activeWallet={storyWallet}
            />
          </ScreenContainer>
        </>
      )}
    </div>
  );
}
