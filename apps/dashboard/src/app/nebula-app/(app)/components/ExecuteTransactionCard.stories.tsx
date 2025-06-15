import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import {
  BadgeContainer,
  storybookLog,
  storybookThirdwebClient,
} from "stories/utils";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { ExecuteTransactionCardLayout } from "./ExecuteTransactionCard";
import type { TxStatus } from "./Swap/common";

const meta = {
  title: "Nebula/actions/ExecuteTransactionCard",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

const exampleTxHash =
  "0xbe81f5a6421625052214b41bb79d1d82751b29aa5639b54d120f00531bb8bcf";

function Story() {
  return (
    <ThirdwebProvider>
      <div className="container flex max-w-[800px] flex-col gap-10 py-10">
        <div>
          <ConnectButton client={storybookThirdwebClient} />
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
        onTxSettled={(txHash) => {
          storybookLog(`onTxSettled called with ${txHash}`);
        }}
        sendTx={async () => {}}
        setStatus={setStatus}
        status={status}
        client={storybookThirdwebClient}
        txData={{
          chainId: 1,
          to: "0xEb0effdFB4dC5b3d5d3aC6ce29F3ED213E95d675", // thirdweb.eth
          data: "0x",
          value: "0x16345785d8a0000", // 0.1 eth
        }}
      />
    </BadgeContainer>
  );
}
