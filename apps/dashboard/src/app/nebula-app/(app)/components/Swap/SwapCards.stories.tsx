import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { BadgeContainer, storybookThirdwebClient } from "stories/utils";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import type { NebulaSwapData } from "../../api/chat";
import {
  ApproveTransactionCardLayout,
  SwapTransactionCardLayout,
} from "./SwapCards";
import type { TxStatus } from "./common";

const meta = {
  title: "Nebula/actions/Swap Cards",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

const swapBaseData: Omit<NebulaSwapData, "action"> = {
  transaction: {
    chainId: 8453,
    to: "0x4200000000000000000000000000000000000006",
    data: "0x095ea7b3000000000000000000000000f8ab2dbe6c43bf1a856471182290f91d621ba76d000000000000000000000000000000000000000000000000016345785d8a0000",
  },
  intent: {
    originChainId: 8453,
    originTokenAddress: "0x4200000000000000000000000000000000000006",
    destinationChainId: 8453,
    destinationTokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    amount: "100000000000000000",
    sender: "0x1E68D1dB85f3F4e1cc8dd816709C529139f79290",
    receiver: "0x1E68D1dB85f3F4e1cc8dd816709C529139f79290",
  },
  from: {
    address: "0x4200000000000000000000000000000000000006",
    amount: "100000000000000000",
    chain_id: 1,
    symbol: "WETH",
    decimals: 18,
  },
  to: {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    amount: "176443798",
    chain_id: 8453,
    symbol: "USDC",
    decimals: 6,
  },
};

export const Swap: Story = {
  args: {
    swapData: {
      ...swapBaseData,
      action: "sell",
    },
  },
};

export const Approve: Story = {
  args: {
    swapData: {
      ...swapBaseData,
      action: "approval",
    },
  },
};

const exampleTxHash =
  "0xbe81f5a6421625052214b41bb79d1d82751b29aa5639b54d120f00531bb8bcf";

function Story(props: {
  swapData: NebulaSwapData;
}) {
  return (
    <ThirdwebProvider>
      <div className="container flex max-w-[800px] flex-col gap-10 py-10">
        <div>
          <ConnectButton client={storybookThirdwebClient} />
        </div>
        <Variant
          label="Idle"
          status={{ type: "idle" }}
          swapData={props.swapData}
        />
        <Variant
          label="Sending"
          status={{ type: "sending" }}
          swapData={props.swapData}
        />
        <Variant
          label="Confirming"
          status={{ type: "confirming", txHash: exampleTxHash }}
          swapData={props.swapData}
        />
        <Variant
          label="Confirmed"
          status={{ type: "confirmed", txHash: exampleTxHash }}
          swapData={props.swapData}
        />
        <Variant
          label="Failed"
          status={{ type: "failed", txHash: exampleTxHash }}
          swapData={props.swapData}
        />
      </div>
    </ThirdwebProvider>
  );
}

function Variant(props: {
  label: string;
  status: TxStatus;
  swapData: NebulaSwapData;
}) {
  const [status, setStatus] = useState<TxStatus>(props.status);
  return (
    <BadgeContainer label={props.label}>
      {props.swapData.action === "approval" ? (
        <ApproveTransactionCardLayout
          sendTx={async () => {}}
          setStatus={setStatus}
          status={status}
          client={storybookThirdwebClient}
          swapData={props.swapData}
        />
      ) : (
        <SwapTransactionCardLayout
          sendTx={async () => {}}
          setStatus={setStatus}
          status={status}
          client={storybookThirdwebClient}
          swapData={props.swapData}
        />
      )}
    </BadgeContainer>
  );
}
