import { useQuery } from "@tanstack/react-query";
import { BuyUIMainScreen } from "../../react/web/ui/ConnectWallet/screens/Buy/main/BuyUIMainScreen.js";
import { PaymentMethodSelectionScreen } from "../../react/web/ui/ConnectWallet/screens/Buy/main/PaymentMethodSelection.js";
import { SwapFlow } from "../../react/web/ui/ConnectWallet/screens/Buy/swap/SwapFlow.js";
import { SwapScreenMainUI } from "../../react/web/ui/ConnectWallet/screens/Buy/swap/SwapScreenMain.js";
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
import type { BuyWithCryptoMocks } from "./mockQuotes.js";

export function BuyWithCryptoFlowTest(props: {
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
        <StoryScreenTitle label="Swap Main screen" />
        <ScreenContainer theme={props.theme}>
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
        </ScreenContainer>
      </div>

      <div>
        <StoryScreenTitle label="Swap Flow" />
        <ScreenContainer theme={props.theme}>
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
        </ScreenContainer>
      </div>

      <Row>
        <div>
          <StoryScreenTitle label="Swap Status: none" />
          <ScreenContainer theme={props.theme}>
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
          </ScreenContainer>
        </div>

        <div>
          <StoryScreenTitle label="Swap Status: Pending" />
          <ScreenContainer theme={props.theme}>
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
          </ScreenContainer>
        </div>
      </Row>

      <Row>
        <div>
          <StoryScreenTitle label="Swap Success" />
          <ScreenContainer theme={props.theme}>
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
              quote={props.mocks.quote}
              statusQuery={failedStatusQuery}
              onBack={noop}
            />
          </ScreenContainer>
        </div>
      </Row>
    </div>
  );
}
