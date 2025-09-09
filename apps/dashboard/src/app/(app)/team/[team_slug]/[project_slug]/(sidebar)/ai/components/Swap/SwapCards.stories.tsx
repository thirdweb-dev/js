import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { BadgeContainer, storybookThirdwebClient } from "@/storybook/utils";
import type { NebulaSwapData } from "../../api/types";
import type { TxStatus } from "./common";
import {
  ApproveTransactionCardLayout,
  SwapTransactionCardLayout,
} from "./SwapCards";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "AI/actions/Swap Cards",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

const swapBaseData: Omit<NebulaSwapData, "action"> = {
  from_token: {
    address: "0x4200000000000000000000000000000000000006",
    amount: "100000000000000000",
    chain_id: 1,
    decimals: 18,
    symbol: "WETH",
  },
  intent: {
    amount: "100000000000000000",
    destination_chain_id: 8453,
    destination_token_address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    origin_chain_id: 8453,
    origin_token_address: "0x4200000000000000000000000000000000000006",
    receiver: "0x1E68D1dB85f3F4e1cc8dd816709C529139f79290",
    sender: "0x1E68D1dB85f3F4e1cc8dd816709C529139f79290",
  },
  to_token: {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    amount: "176443798",
    chain_id: 8453,
    decimals: 6,
    symbol: "USDC",
  },
  transaction: {
    chain_id: 8453,
    data: "0x095ea7b3000000000000000000000000f8ab2dbe6c43bf1a856471182290f91d621ba76d000000000000000000000000000000000000000000000000016345785d8a0000",
    to: "0x4200000000000000000000000000000000000006",
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

function Story(props: { swapData: NebulaSwapData }) {
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
          status={{ txHash: exampleTxHash, type: "confirming" }}
          swapData={props.swapData}
        />
        <Variant
          label="Confirmed"
          status={{ txHash: exampleTxHash, type: "confirmed" }}
          swapData={props.swapData}
        />
        <Variant
          label="Failed"
          status={{ txHash: exampleTxHash, type: "failed" }}
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
          client={storybookThirdwebClient}
          sendTx={async () => {}}
          setStatus={setStatus}
          status={status}
          swapData={props.swapData}
        />
      ) : (
        <SwapTransactionCardLayout
          client={storybookThirdwebClient}
          sendTx={async () => {}}
          setStatus={setStatus}
          status={status}
          swapData={props.swapData}
        />
      )}
    </BadgeContainer>
  );
}
