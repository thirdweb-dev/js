import type { Meta, StoryObj } from "@storybook/react";
import { useQuery } from "@tanstack/react-query";
import { base } from "../../chains/chain-definitions/base.js";
import { polygon } from "../../chains/chain-definitions/polygon.js";
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
import { SwapScreenMainUI } from "../../react/web/ui/ConnectWallet/screens/Buy/swap/SwapScreenMain.js";
import { SwapStatusScreenUI } from "../../react/web/ui/ConnectWallet/screens/Buy/swap/SwapStatusScreen.js";
import {
  type SupportedChainAndTokens,
  useBuySupportedDestinations,
} from "../../react/web/ui/ConnectWallet/screens/Buy/swap/useSwapSupportedChains.js";
import { StoryScreenTitle, storyAccount, storyClient } from "../utils.js";
import { PayScreenContainer } from "./PayScreenContainer.js";
import {
  type BuyWithCryptoMocks,
  type BuyWithFiatMocks,
  getBuyBaseUSDCWithUSDFiatMocks,
  getBuyPolygonWithUSDCMocks,
  getBuyPolygonWithUSDFiatMocks,
} from "./mockQuotes.js";

const noop = () => {};

function Test(props: {
  theme: "dark" | "light";
}) {
  const supportedDestinationsQuery = useBuySupportedDestinations(storyClient);

  if (!supportedDestinationsQuery.data) {
    return <div> Loading story </div>;
  }

  const polygonTokens = supportedDestinationsQuery.data.find(
    (x) => x.chain.id === polygon.id,
  );

  const baseTokens = supportedDestinationsQuery.data.find(
    (x) => x.chain.id === base.id,
  );

  const usdcPolygon = polygonTokens?.tokens.find((x) => x.symbol === "USDC");

  if (!usdcPolygon) {
    return <div> failed to find polygon USDC </div>;
  }

  const usdcBase = baseTokens?.tokens.find((x) => x.symbol === "USDC");

  if (!usdcBase) {
    return <div> failed to find base USDC </div>;
  }

  return (
    <div>
      <Row>
        <BuyWithCryptoFlowTest
          mocks={getBuyPolygonWithUSDCMocks({
            fromAddress: storyAccount.address,
            toAddress: storyAccount.address,
          })}
          theme={props.theme}
          supportedDestinations={supportedDestinationsQuery.data}
        />

        <BuyWithFiatFlowTest
          mocks={getBuyPolygonWithUSDFiatMocks({
            fromAddress: storyAccount.address,
            toAddress: storyAccount.address,
          })}
          theme={props.theme}
          supportedDestinations={supportedDestinationsQuery.data}
        />

        <BuyWithFiatFlowTest
          mocks={getBuyBaseUSDCWithUSDFiatMocks({
            fromAddress: storyAccount.address,
            toAddress: storyAccount.address,
          })}
          theme={props.theme}
          supportedDestinations={supportedDestinationsQuery.data}
        />
      </Row>
    </div>
  );
}

function BuyWithCryptoFlowTest(props: {
  mocks: BuyWithCryptoMocks;
  theme: "dark" | "light";
  supportedDestinations: SupportedChainAndTokens;
}) {
  const quoteQuery = useQuery({
    queryKey: ["crypto.mock.quote", props.mocks.meta],
    queryFn: () => Promise.resolve(props.mocks.quote),
  });

  const noneStatusQuery = useQuery({
    queryKey: ["crypto.status.none", props.mocks.meta],
    queryFn: () => Promise.resolve(props.mocks.status.none),
  });

  const pendingStatusQuery = useQuery({
    queryKey: ["crypto.status.pending", props.mocks.meta],
    queryFn: () => Promise.resolve(props.mocks.status.pending),
  });

  const failedStatusQuery = useQuery({
    queryKey: ["crypto.status.failed", props.mocks.meta],
    queryFn: () => Promise.resolve(props.mocks.status.failed),
  });

  const sucessStatusQuery = useQuery({
    queryKey: ["crypto.status.success", props.mocks.meta],
    queryFn: () => Promise.resolve(props.mocks.status.success),
  });

  return (
    <div>
      <StoryScreenTitle label={props.mocks.meta.label} large />

      <div>
        <StoryScreenTitle label="Initial Screen: No amount, chain selected" />
        <PayScreenContainer theme={props.theme}>
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
        </PayScreenContainer>
      </div>

      <div>
        <StoryScreenTitle label="Initial Screen: Amount entered" />
        <PayScreenContainer theme={props.theme}>
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
        </PayScreenContainer>
      </div>

      <div>
        <StoryScreenTitle label="Payment method selection" />
        <PayScreenContainer theme={props.theme}>
          <PaymentMethodSelectionScreen
            client={storyClient}
            onBack={noop}
            selectedChain={props.mocks.meta.buyChain}
            selectedToken={props.mocks.meta.buyToken}
            setScreen={noop}
            tokenAmount={props.mocks.meta.buyTokenAmount}
          />
        </PayScreenContainer>
      </div>

      <div>
        <StoryScreenTitle label="Swap Main screen" />
        <PayScreenContainer theme={props.theme}>
          <SwapScreenMainUI
            client={storyClient}
            onBack={noop}
            account={storyAccount}
            // wallet on same chain as buy chain
            activeChain={props.mocks.meta.buyChain}
            fromChain={props.mocks.meta.fromChain}
            buyForTx={null}
            isEmbed={true}
            fromToken={props.mocks.meta.fromToken}
            onDone={noop}
            onViewPendingTx={noop}
            payOptions={{}}
            setDrawerScreen={noop}
            setScreen={noop}
            showFromTokenSelector={noop}
            toChain={props.mocks.meta.buyChain}
            toToken={props.mocks.meta.buyToken}
            tokenAmount={props.mocks.meta.buyTokenAmount}
            quoteQuery={quoteQuery}
          />
        </PayScreenContainer>
      </div>

      <div>
        <StoryScreenTitle label="Swap Flow" />
        <PayScreenContainer theme={props.theme}>
          <SwapFlow
            isEmbed={true}
            account={storyAccount}
            buyWithCryptoQuote={props.mocks.quote}
            client={storyClient}
            isBuyForTx={false}
            isFiatFlow={false}
            onDone={noop}
            onTryAgain={noop}
            onViewPendingTx={noop}
            onBack={noop}
          />
        </PayScreenContainer>
      </div>

      <Row>
        <div>
          <StoryScreenTitle label="Swap Status: none" />
          <PayScreenContainer theme={props.theme}>
            <SwapStatusScreenUI
              client={storyClient}
              isBuyForTx={false}
              isEmbed={true}
              onDone={noop}
              onTryAgain={noop}
              onViewPendingTx={noop}
              quote={props.mocks.quote}
              statusQuery={noneStatusQuery}
              onBack={noop}
            />
          </PayScreenContainer>
        </div>

        <div>
          <StoryScreenTitle label="Swap Status: Pending" />
          <PayScreenContainer theme={props.theme}>
            <SwapStatusScreenUI
              client={storyClient}
              isBuyForTx={false}
              isEmbed={true}
              onDone={noop}
              onTryAgain={noop}
              onViewPendingTx={noop}
              quote={props.mocks.quote}
              statusQuery={pendingStatusQuery}
              onBack={noop}
            />
          </PayScreenContainer>
        </div>
      </Row>

      <Row>
        <div>
          <StoryScreenTitle label="Swap Success" />
          <PayScreenContainer theme={props.theme}>
            <SwapStatusScreenUI
              client={storyClient}
              isBuyForTx={false}
              isEmbed={true}
              onDone={noop}
              onTryAgain={noop}
              onViewPendingTx={noop}
              quote={props.mocks.quote}
              statusQuery={sucessStatusQuery}
              onBack={noop}
            />
          </PayScreenContainer>
        </div>

        <div>
          <StoryScreenTitle label="Swap Failed" />
          <PayScreenContainer theme={props.theme}>
            <SwapStatusScreenUI
              client={storyClient}
              isBuyForTx={false}
              isEmbed={true}
              onDone={noop}
              onTryAgain={noop}
              onViewPendingTx={noop}
              quote={props.mocks.quote}
              statusQuery={failedStatusQuery}
              onBack={noop}
            />
          </PayScreenContainer>
        </div>
      </Row>
    </div>
  );
}

function BuyWithFiatFlowTest(props: {
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
        <PayScreenContainer theme={props.theme}>
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
        </PayScreenContainer>
      </div>

      <div>
        <StoryScreenTitle label="Initial Screen: Amount entered" />
        <PayScreenContainer theme={props.theme}>
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
        </PayScreenContainer>
      </div>

      <div>
        <StoryScreenTitle label="Payment method selection" />
        <PayScreenContainer theme={props.theme}>
          <PaymentMethodSelectionScreen
            client={storyClient}
            onBack={noop}
            selectedChain={props.mocks.meta.buyChain}
            selectedToken={props.mocks.meta.buyToken}
            setScreen={noop}
            tokenAmount={props.mocks.meta.buyTokenAmount}
          />
        </PayScreenContainer>
      </div>

      <div>
        <StoryScreenTitle label="Fiat Main screen" />
        <PayScreenContainer theme={props.theme}>
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
        </PayScreenContainer>
      </div>

      {props.mocks.type === "onrampandswap" && (
        <div>
          <StoryScreenTitle label="Two steps ui" />
          <PayScreenContainer theme={props.theme}>
            <FiatSteps
              client={storyClient}
              onBack={noop}
              onContinue={noop}
              partialQuote={fiatQuoteToPartialQuote(props.mocks.quote)}
              step={1}
            />
          </PayScreenContainer>
        </div>
      )}

      <Row>
        <div>
          <StoryScreenTitle label="Onramp status: none" />
          <PayScreenContainer theme={props.theme}>
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
          </PayScreenContainer>
        </div>

        <div>
          <StoryScreenTitle label="Onramp status: pending" />
          <PayScreenContainer theme={props.theme}>
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
          </PayScreenContainer>
        </div>
      </Row>

      {props.mocks.type === "onramponly" && (
        <>
          <Row>
            <div>
              <StoryScreenTitle label="Onramp status: success" />
              <PayScreenContainer theme={props.theme}>
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
              </PayScreenContainer>
            </div>

            <div>
              <StoryScreenTitle label="Onramp status: failed" />
              <PayScreenContainer theme={props.theme}>
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
              </PayScreenContainer>
            </div>
          </Row>
        </>
      )}

      {props.mocks.type === "onrampandswap" && (
        <>
          <div>
            <StoryScreenTitle label="Onramp completed, swap required" />
            <PayScreenContainer theme={props.theme}>
              <FiatSteps
                client={storyClient}
                onBack={noop}
                onContinue={noop}
                partialQuote={fiatQuoteToPartialQuote(props.mocks.quote)}
                step={2}
                status={props.mocks.onrampStatus.swapRequired}
              />
            </PayScreenContainer>
          </div>

          <div>
            <Row>
              <div>
                <StoryScreenTitle label="Getting Post onramp quote" />
                <PayScreenContainer theme={props.theme}>
                  <GettingPostOnRampQuote onBack={noop} />
                </PayScreenContainer>
              </div>

              <div>
                <StoryScreenTitle label="Failed to get post onramp quote" />
                <PayScreenContainer theme={props.theme}>
                  <PostOnrampQuoteFailed onBack={noop} onRetry={noop} />
                </PayScreenContainer>
              </div>
            </Row>
          </div>

          <div>
            <StoryScreenTitle label="Swap Flow" />
            <PayScreenContainer theme={props.theme}>
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
            </PayScreenContainer>
          </div>

          <div>
            <StoryScreenTitle label="Swap Pending" />
            <PayScreenContainer theme={props.theme}>
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
            </PayScreenContainer>
          </div>

          <Row>
            <div>
              <StoryScreenTitle label="Postonramp Swap: Success" />
              <PayScreenContainer theme={props.theme}>
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
              </PayScreenContainer>
            </div>

            <div>
              <StoryScreenTitle label="Swap Failed" />
              <PayScreenContainer theme={props.theme}>
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
              </PayScreenContainer>
            </div>
          </Row>
        </>
      )}
    </div>
  );
}

function Row(props: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
      }}
    >
      {props.children}
    </div>
  );
}

const meta = {
  title: "Pay Flows",
  component: Test,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Test>;

type Story = StoryObj<typeof meta>;

export const Dark: Story = {
  args: {
    theme: "dark",
  },
};

export const Light: Story = {
  args: {
    theme: "light",
  },
};

export default meta;
