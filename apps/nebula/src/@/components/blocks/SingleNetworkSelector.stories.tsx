import { BadgeContainer, storybookThirdwebClient } from "@/storybook/utils";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { SingleNetworkSelector } from "./NetworkSelectors";

const meta = {
  title: "blocks/SingleNetworkSelector",
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
      <Variant label="No Chain ID selected by default" chainId={undefined} />
      <Variant label="Polygon selected by default" chainId={137} />
      <Variant
        label="Show certain chains only"
        chainId={undefined}
        chainIds={[1, 137, 10]}
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
        client={storybookThirdwebClient}
        chainId={chainId}
        onChange={setChainId}
        chainIds={props.chainIds}
      />
    </BadgeContainer>
  );
}
