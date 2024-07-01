import { useQuery } from "@tanstack/react-query";
import { BuyUIMainScreen } from "../../react/web/ui/ConnectWallet/screens/Buy/main/BuyUIMainScreen.js";
import { PaymentMethodSelectionScreen } from "../../react/web/ui/ConnectWallet/screens/Buy/main/PaymentMethodSelection.js";
import { SwapFlow } from "../../react/web/ui/ConnectWallet/screens/Buy/swap/SwapFlow.js";
import { SwapScreenMainUI } from "../../react/web/ui/ConnectWallet/screens/Buy/swap/SwapScreenMain.js";
import type { SupportedChainAndTokens } from "../../react/web/ui/ConnectWallet/screens/Buy/swap/useSwapSupportedChains.js";
import {
  StoryScreenTitle,
  noop,
  storyAccount,
  storyClient,
  storyWallet,
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

      <ScreenContainer theme={props.theme} label="Swap Main screen">
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
          activeWallet={storyWallet}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap Flow">
        <SwapFlow
          isEmbed={true}
          account={storyAccount}
          buyWithCryptoQuote={props.mocks.quote}
          client={storyClient}
          onDone={noop}
          onTryAgain={noop}
          onBack={noop}
          activeChain={props.mocks.meta.buyChain}
          activeWallet={storyWallet}
        />
      </ScreenContainer>
    </div>
  );
}
