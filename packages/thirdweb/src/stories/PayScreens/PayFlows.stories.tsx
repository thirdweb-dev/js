import type { Meta, StoryObj } from "@storybook/react";
import { useQuery } from "@tanstack/react-query";
import { base } from "../../chains/chain-definitions/base.js";
import { polygon } from "../../chains/chain-definitions/polygon.js";
import type { Chain } from "../../chains/types.js";
import type { BuyWithCryptoQuote } from "../../pay/buyWithCrypto/getQuote.js";
import type { BuyWithCryptoStatus } from "../../pay/buyWithCrypto/getStatus.js";
import { BuyUIMainScreen } from "../../react/web/ui/ConnectWallet/screens/Buy/main/BuyUIMainScreen.js";
import { PaymentMethodSelectionScreen } from "../../react/web/ui/ConnectWallet/screens/Buy/main/PaymentMethodSelection.js";
import { SwapFlow } from "../../react/web/ui/ConnectWallet/screens/Buy/swap/SwapFlow.js";
import { SwapScreenMainUI } from "../../react/web/ui/ConnectWallet/screens/Buy/swap/SwapScreenMain.js";
import { SwapStatusScreenUI } from "../../react/web/ui/ConnectWallet/screens/Buy/swap/SwapStatusScreen.js";
import {
  type SupportedChainAndTokens,
  useBuySupportedDestinations,
} from "../../react/web/ui/ConnectWallet/screens/Buy/swap/useSwapSupportedChains.js";
import type { ERC20OrNativeToken } from "../../react/web/ui/ConnectWallet/screens/nativeToken.js";
import { StoryScreenTitle, storyAccount, storyClient } from "../utils.js";
import { PayScreenContainer } from "./PayScreenContainer.js";
import { buyPolygonWithUSDCMocks } from "./mockQuotes.js";

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

  const mocks = buyPolygonWithUSDCMocks();

  return (
    <div>
      <Row>
        <BuyWithCryptoFlowTest
          flowLabel="Buy 5 Polygon Matic with polygon USDC"
          buyToken={{ nativeToken: true }}
          tokenAmount="5"
          buyChain={polygon}
          theme={props.theme}
          supportedDestinations={supportedDestinationsQuery.data}
          fromChain={polygon}
          fromToken={usdcPolygon}
          swapQuote={mocks.quote}
          statuses={{
            pending: mocks.pendingStatus,
            success: mocks.successStatus,
          }}
        />
      </Row>
    </div>
  );
}

function BuyWithCryptoFlowTest(props: {
  flowLabel: string;
  buyToken: ERC20OrNativeToken;
  tokenAmount: string;
  buyChain: Chain;
  theme: "dark" | "light";
  supportedDestinations: SupportedChainAndTokens;
  fromChain: Chain;
  fromToken: ERC20OrNativeToken;
  swapQuote: BuyWithCryptoQuote;
  statuses: {
    pending: BuyWithCryptoStatus;
    success: BuyWithCryptoStatus;
  };
}) {
  const swapQuoteQuery = useQuery({
    queryKey: [
      "BuyWithCryptoFlowTest.quote",
      props.swapQuote.transactionRequest.data,
    ],
    queryFn: () => Promise.resolve(props.swapQuote),
  });

  const statusPendingQuery = useQuery({
    queryKey: ["BuyWithCryptoFlowTest.status.pending", props.statuses.pending],
    queryFn: () => Promise.resolve(props.statuses.pending),
  });

  const statusCompletedQuery = useQuery({
    queryKey: ["BuyWithCryptoFlowTest.status.success", props.statuses.success],
    queryFn: () => Promise.resolve(props.statuses.success),
  });

  return (
    <div>
      <StoryScreenTitle label={props.flowLabel} large />

      <div>
        <StoryScreenTitle label="0. Initial Screen: No amount, chain selected" />
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
            toChain={props.buyChain}
            toToken={props.buyToken}
            tokenAmount=""
          />
        </PayScreenContainer>
      </div>

      <div>
        <StoryScreenTitle label="1. Initial Screen: Amount entered" />
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
            toChain={props.buyChain}
            toToken={props.buyToken}
            tokenAmount={props.tokenAmount}
          />
        </PayScreenContainer>
      </div>

      <div>
        <StoryScreenTitle label="2. Payment method selection" />
        <PayScreenContainer theme={props.theme}>
          <PaymentMethodSelectionScreen
            client={storyClient}
            onBack={noop}
            selectedChain={props.buyChain}
            selectedToken={props.buyToken}
            setScreen={noop}
            tokenAmount={props.tokenAmount}
          />
        </PayScreenContainer>
      </div>

      <div>
        <StoryScreenTitle label="3. Swap Main screen" />
        <PayScreenContainer theme={props.theme}>
          <SwapScreenMainUI
            client={storyClient}
            onBack={noop}
            account={storyAccount}
            // wallet on same chain as buy chain
            activeChain={props.fromChain}
            fromChain={props.fromChain}
            buyForTx={null}
            isEmbed={true}
            fromToken={props.fromToken}
            onDone={noop}
            onViewPendingTx={noop}
            payOptions={{}}
            setDrawerScreen={noop}
            setScreen={noop}
            showFromTokenSelector={noop}
            toChain={props.buyChain}
            toToken={props.buyToken}
            tokenAmount={props.tokenAmount}
            quoteQuery={swapQuoteQuery}
          />
        </PayScreenContainer>
      </div>

      <div>
        <StoryScreenTitle label="3. Swap Flow" />
        <PayScreenContainer theme={props.theme}>
          <SwapFlow
            isEmbed={true}
            account={storyAccount}
            buyWithCryptoQuote={props.swapQuote}
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
        <StoryScreenTitle label="3. Status: Pending" />
        <PayScreenContainer theme={props.theme}>
          <SwapStatusScreenUI
            client={storyClient}
            isBuyForTx={false}
            isEmbed={true}
            onDone={noop}
            onTryAgain={noop}
            onViewPendingTx={noop}
            quote={props.swapQuote}
            statusQuery={statusPendingQuery}
            onBack={noop}
          />
        </PayScreenContainer>
      </div>

      <div>
        <StoryScreenTitle label="3. Status: Success" />
        <PayScreenContainer theme={props.theme}>
          <SwapStatusScreenUI
            client={storyClient}
            isBuyForTx={false}
            isEmbed={true}
            onDone={noop}
            onTryAgain={noop}
            onViewPendingTx={noop}
            quote={props.swapQuote}
            statusQuery={statusCompletedQuery}
            onBack={noop}
          />
        </PayScreenContainer>
      </div>
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
