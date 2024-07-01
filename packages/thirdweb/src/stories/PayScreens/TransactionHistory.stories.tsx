import type { Meta, StoryObj } from "@storybook/react";
import { useQuery } from "@tanstack/react-query";
import { ethereum } from "../../chains/chain-definitions/ethereum.js";
import { polygon } from "../../chains/chain-definitions/polygon.js";
import { useBuySupportedDestinations } from "../../react/web/ui/ConnectWallet/screens/Buy/swap/useSwapSupportedChains.js";
import { BuyTxHistoryListUI } from "../../react/web/ui/ConnectWallet/screens/Buy/tx-history/BuyTxHistory.js";
import { FiatDetailsScreenUI } from "../../react/web/ui/ConnectWallet/screens/Buy/tx-history/FiatDetailsScreen.js";
import { SwapDetailsScreenUI } from "../../react/web/ui/ConnectWallet/screens/Buy/tx-history/SwapDetailsScreen.js";
import { TxDetailsScreen } from "../../react/web/ui/ConnectWallet/screens/Buy/tx-history/TxDetailsScreen.js";
import { storyAccount, storyClient, storyWallet } from "../utils.js";
import { Row, noop } from "../utils.js";
import { ScreenContainer } from "./ScreenContainer.js";
import {
  completedSwapTxStatus,
  failedSwapTxStatus,
  mockBuyTxHistory,
  onRampCompleteSwapRequiredTxStatus,
  onRampCompletedNoSwapRequired,
  onRampCompletedSwapCompletedTxStatus,
  onRampPendingSwapRequiredTxStatus,
} from "./mockHistory.js";

function TransactionHistoryTest(props: {
  theme: "dark" | "light";
}) {
  const buyHistoryQuery = useQuery({
    queryKey: ["mock.history"],
    queryFn: () => mockBuyTxHistory,
  });

  return (
    <div>
      <ScreenContainer theme={props.theme} label="Transaction history">
        <BuyTxHistoryListUI
          buyHistory={buyHistoryQuery}
          client={storyClient}
          onDone={noop}
          onSelectTx={noop}
          pageIndex={0}
          setPageIndex={noop}
          onBack={noop}
          account={storyAccount}
          activeChain={polygon}
        />
      </ScreenContainer>

      <Row>
        <ScreenContainer theme={props.theme} label="Swap Completed">
          <SwapDetailsScreenUI
            client={storyClient}
            onBack={noop}
            status={completedSwapTxStatus}
          />
        </ScreenContainer>

        <ScreenContainer theme={props.theme} label="Swap Failed">
          <SwapDetailsScreenUI
            client={storyClient}
            onBack={noop}
            status={failedSwapTxStatus}
          />
        </ScreenContainer>

        <div>
          <ScreenContainer
            theme={props.theme}
            label="OnRamp Pending, Swap Required"
          >
            <FiatDetailsScreenUI
              client={storyClient}
              isBuyForTx={false}
              isEmbed={true}
              onBack={noop}
              onDone={noop}
              status={onRampPendingSwapRequiredTxStatus}
              stopPollingStatus={noop}
              activeChain={ethereum}
              activeWallet={storyWallet}
            />
          </ScreenContainer>

          <ScreenContainer
            theme={props.theme}
            label="OnRamp Completed, Swap Required"
          >
            <FiatDetailsScreenUI
              client={storyClient}
              isBuyForTx={false}
              isEmbed={true}
              onBack={noop}
              onDone={noop}
              status={onRampCompleteSwapRequiredTxStatus}
              stopPollingStatus={noop}
              activeChain={ethereum}
              activeWallet={storyWallet}
            />
          </ScreenContainer>

          <ScreenContainer
            theme={props.theme}
            label="OnRamp Completed, Swap Completed"
          >
            <FiatDetailsScreenUI
              client={storyClient}
              isBuyForTx={false}
              isEmbed={true}
              onBack={noop}
              onDone={noop}
              status={onRampCompletedSwapCompletedTxStatus}
              stopPollingStatus={noop}
              activeChain={ethereum}
              activeWallet={storyWallet}
            />
          </ScreenContainer>
        </div>

        <ScreenContainer
          theme={props.theme}
          label="OnRamp Completed, No Swap Required"
        >
          <TxDetailsScreen
            client={storyClient}
            isBuyForTx={false}
            isEmbed={true}
            onBack={noop}
            onDone={noop}
            statusInfo={{
              status: onRampCompletedNoSwapRequired,
              type: "fiat",
            }}
            activeChain={ethereum}
            activeWallet={storyWallet}
          />
        </ScreenContainer>
      </Row>
    </div>
  );
}

function Test(props: {
  theme: "dark" | "light";
}) {
  const supportedDestinationsQuery = useBuySupportedDestinations(storyClient);

  if (!supportedDestinationsQuery.data) {
    return <div> Loading story </div>;
  }

  return (
    <div>
      <TransactionHistoryTest theme={props.theme} />
    </div>
  );
}

const meta = {
  title: "Pay/Buy Tx History",
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
