import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { accountStub } from "../../../../stories/stubs";
import { BadgeContainer, mobileViewport } from "../../../../stories/utils";
import {
  ExecuteTransactionCardLayout,
  type TxStatus,
} from "./ExecuteTransactionCard";

const meta = {
  title: "Nebula/ExecuteTransactionCard",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {},
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

const client = getThirdwebClient();

const exampleTxHash =
  "0xbe81f5a6421625052214b41bb79d1d82751b29aa5639b54d120f00531bb8bcf";

function Story() {
  return (
    <ThirdwebProvider>
      <div className="container flex max-w-[800px] flex-col gap-10 py-10">
        <div>
          <ConnectButton client={client} />
        </div>
        <Variant label="Idle" status={{ type: "idle" }} />
        <Variant label="Sending" status={{ type: "sending" }} />
        <Variant
          label="Confirming"
          status={{ type: "confirming", txHash: exampleTxHash }}
        />
        <Variant
          label="Confirmed"
          status={{ type: "confirmed", txHash: exampleTxHash }}
        />
        <Variant
          label="Failed"
          status={{ type: "failed", txHash: exampleTxHash }}
        />
      </div>
    </ThirdwebProvider>
  );
}

function Variant(props: {
  label: string;
  status: TxStatus;
}) {
  const [status, setStatus] = useState<TxStatus>(props.status);
  return (
    <BadgeContainer label={props.label}>
      <ExecuteTransactionCardLayout
        setStatus={setStatus}
        status={status}
        client={client}
        twAccount={accountStub()}
        txData={{
          chainId: 1,
          to: "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
          data: "0x",
          value: "0x16345785d8a0000",
        }}
      />
    </BadgeContainer>
  );
}
