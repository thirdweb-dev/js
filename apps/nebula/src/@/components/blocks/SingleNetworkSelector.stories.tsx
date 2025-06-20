import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { BadgeContainer, storybookThirdwebClient } from "@/storybook/utils";
import { SingleNetworkSelector } from "./NetworkSelectors";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "blocks/SingleNetworkSelector",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function Story() {
  return (
    <div className="container flex max-w-6xl flex-col gap-8 py-10">
      <Variant chainId={undefined} label="No Chain ID selected by default" />
      <Variant chainId={137} label="Polygon selected by default" />
      <Variant
        chainId={undefined}
        chainIds={[1, 137, 10]}
        label="Show certain chains only"
      />
    </div>
  );
}

function Variant(props: {
  label: string;
  chainId: number | undefined;
  chainIds?: number[];
}) {
  const [chainId, setChainId] = useState<number | undefined>(props.chainId);
  return (
    <BadgeContainer label={props.label}>
      <SingleNetworkSelector
        chainId={chainId}
        chainIds={props.chainIds}
        client={storybookThirdwebClient}
        onChange={setChainId}
      />
    </BadgeContainer>
  );
}
