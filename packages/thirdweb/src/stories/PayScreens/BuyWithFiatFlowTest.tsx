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
import { SwapStatusScreenUI } from "../../react/web/ui/ConnectWallet/screens/Buy/swap/SwapStatusScreen.js";
import type { SupportedChainAndTokens } from "../../react/web/ui/ConnectWallet/screens/Buy/swap/useSwapSupportedChains.js";
import {
  Row,
  StoryScreenTitle,
  noop,
  storyAccount,
  storyClient,
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

  const postonrampStatusPendingQuery = useQuery({
    queryKey: ["postonramp.status.pending", props.mocks.meta],
    queryFn: () => {
      if (props.mocks.type === "onrampandswap") {
        return props.mocks.postOnrampSwap.status.pending;
      }

      throw new Error("invalid");
    },
  });

  const postonrampStatusSuccessQuery = useQuery({
    queryKey: ["postonramp.status.success", props.mocks.meta],
    queryFn: () => {
      if (props.mocks.type === "onrampandswap") {
        return props.mocks.postOnrampSwap.status.success;
      }

      throw new Error("invalid");
    },
  });

  const postonrampStatusFailedQuery = useQuery({
    queryKey: ["postonramp.status.failed", props.mocks.meta],
    queryFn: () => {
      if (props.mocks.type === "onrampandswap") {
        return props.mocks.postOnrampSwap.status.failed;
      }

      throw new Error("invalid");
    },
  });

  return (
    <div>
      <StoryScreenTitle label={props.mocks.meta.label} large />

      <div>
        <StoryScreenTitle label="Initial Screen: No amount, chain selected" />
        <ScreenContainer theme={props.theme}>
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
      </div>

      <div>
        <StoryScreenTitle label="Initial Screen: Amount entered" />
        <ScreenContainer theme={props.theme}>
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
      </div>

      <div>
        <StoryScreenTitle label="Payment method selection" />
        <ScreenContainer theme={props.theme}>
          <PaymentMethodSelectionScreen
            client={storyClient}
            onBack={noop}
            selectedChain={props.mocks.meta.buyChain}
            selectedToken={props.mocks.meta.buyToken}
            setScreen={noop}
            tokenAmount={props.mocks.meta.buyTokenAmount}
          />
        </ScreenContainer>
      </div>

      <div>
        <StoryScreenTitle label="Fiat Main screen" />
        <ScreenContainer theme={props.theme}>
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
          />
        </ScreenContainer>
      </div>

      {props.mocks.type === "onrampandswap" && (
        <div>
          <StoryScreenTitle label="Two steps ui" />
          <ScreenContainer theme={props.theme}>
            <FiatSteps
              client={storyClient}
              onBack={noop}
              onContinue={noop}
              partialQuote={fiatQuoteToPartialQuote(props.mocks.quote)}
              step={1}
            />
          </ScreenContainer>
        </div>
      )}

      <Row>
        <div>
          <StoryScreenTitle label="Onramp status: none" />
          <ScreenContainer theme={props.theme}>
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
        </div>

        <div>
          <StoryScreenTitle label="Onramp status: pending" />
          <ScreenContainer theme={props.theme}>
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
        </div>
      </Row>

      {props.mocks.type === "onramponly" && (
        <>
          <Row>
            <div>
              <StoryScreenTitle label="Onramp status: success" />
              <ScreenContainer theme={props.theme}>
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
            </div>

            <div>
              <StoryScreenTitle label="Onramp status: failed" />
              <ScreenContainer theme={props.theme}>
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
            </div>
          </Row>
        </>
      )}

      {props.mocks.type === "onrampandswap" && (
        <>
          <div>
            <StoryScreenTitle label="Onramp completed, swap required" />
            <ScreenContainer theme={props.theme}>
              <FiatSteps
                client={storyClient}
                onBack={noop}
                onContinue={noop}
                partialQuote={fiatQuoteToPartialQuote(props.mocks.quote)}
                step={2}
                status={props.mocks.onrampStatus.swapRequired}
              />
            </ScreenContainer>
          </div>

          <div>
            <Row>
              <div>
                <StoryScreenTitle label="Getting Post onramp quote" />
                <ScreenContainer theme={props.theme}>
                  <GettingPostOnRampQuote onBack={noop} />
                </ScreenContainer>
              </div>

              <div>
                <StoryScreenTitle label="Failed to get post onramp quote" />
                <ScreenContainer theme={props.theme}>
                  <PostOnrampQuoteFailed onBack={noop} onRetry={noop} />
                </ScreenContainer>
              </div>
            </Row>
          </div>

          <div>
            <StoryScreenTitle label="Swap Flow" />
            <ScreenContainer theme={props.theme}>
              <SwapFlow
                isEmbed={true}
                account={storyAccount}
                buyWithCryptoQuote={props.mocks.postOnrampSwap.quote}
                client={storyClient}
                isBuyForTx={false}
                isFiatFlow={false}
                onDone={noop}
                onTryAgain={noop}
                onViewPendingTx={noop}
                onBack={noop}
              />
            </ScreenContainer>
          </div>

          <div>
            <StoryScreenTitle label="Swap Pending" />
            <ScreenContainer theme={props.theme}>
              <SwapStatusScreenUI
                client={storyClient}
                isBuyForTx={false}
                isEmbed={true}
                onDone={noop}
                onTryAgain={noop}
                onViewPendingTx={noop}
                quote={props.mocks.postOnrampSwap.quote}
                statusQuery={postonrampStatusPendingQuery}
                onBack={noop}
              />
            </ScreenContainer>
          </div>

          <Row>
            <div>
              <StoryScreenTitle label="Postonramp Swap: Success" />
              <ScreenContainer theme={props.theme}>
                <SwapStatusScreenUI
                  client={storyClient}
                  isBuyForTx={false}
                  isEmbed={true}
                  onDone={noop}
                  onTryAgain={noop}
                  onViewPendingTx={noop}
                  quote={props.mocks.postOnrampSwap.quote}
                  statusQuery={postonrampStatusSuccessQuery}
                  onBack={noop}
                />
              </ScreenContainer>
            </div>

            <div>
              <StoryScreenTitle label="Swap Failed" />
              <ScreenContainer theme={props.theme}>
                <SwapStatusScreenUI
                  client={storyClient}
                  isBuyForTx={false}
                  isEmbed={true}
                  onDone={noop}
                  onTryAgain={noop}
                  onViewPendingTx={noop}
                  quote={props.mocks.postOnrampSwap.quote}
                  statusQuery={postonrampStatusFailedQuery}
                  onBack={noop}
                />
              </ScreenContainer>
            </div>
          </Row>
        </>
      )}
    </div>
  );
}
