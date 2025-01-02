import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BadgeContainer, mobileViewport } from "../../../stories/utils";
import { MultiNetworkSelector } from "./NetworkSelectors";

const meta = {
  title: "blocks/Cards/MultiNetworkSelector",
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
      <Variant label="No Chains selected by default" selectedChainIds={[]} />
      <Variant
        label="Polygon, Ethereum selected by default"
        selectedChainIds={[1, 137]}
      />
    </div>
  );
}

function Variant(props: {
  label: string;
  selectedChainIds: number[];
}) {
  const [chainIds, setChainIds] = useState<number[]>(props.selectedChainIds);
  return (
    <BadgeContainer label={props.label}>
      <MultiNetworkSelector
        selectedChainIds={chainIds}
        onChange={setChainIds}
      />
    </BadgeContainer>
  );
}
