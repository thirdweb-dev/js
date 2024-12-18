import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BadgeContainer, mobileViewport } from "../../../stories/utils";
import { SingleNetworkSelector } from "./NetworkSelectors";

const meta = {
  title: "blocks/Cards/SingleNetworkSelector",
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

function Story() {
  return (
    <div className="container flex max-w-[1000px] flex-col gap-8 lg:p-10">
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
        chainId={chainId}
        onChange={setChainId}
        chainIds={props.chainIds}
      />
    </BadgeContainer>
  );
}
