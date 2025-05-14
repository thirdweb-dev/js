import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  BadgeContainer,
  storybookThirdwebClient,
} from "../../../stories/utils";
import { TokenSelector } from "./TokenSelector";

const meta = {
  title: "blocks/Cards/TokenSelector",
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

function Story() {
  return (
    <div className="container flex max-w-6xl flex-col gap-8 py-10">
      <Variant label="No Chains selected by default" />
    </div>
  );
}

function Variant(props: {
  label: string;
  selectedChainId?: number;
}) {
  const [tokenAddress, setTokenAddress] = useState<string>("");
  return (
    <BadgeContainer label={props.label}>
      <TokenSelector
        tokenAddress={tokenAddress}
        chainId={props.selectedChainId}
        client={storybookThirdwebClient}
        onChange={setTokenAddress}
      />
    </BadgeContainer>
  );
}
