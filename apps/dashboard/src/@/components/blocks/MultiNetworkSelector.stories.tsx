import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  BadgeContainer,
  storybookThirdwebClient,
} from "../../../stories/utils";
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

export const Variants: Story = {
  args: {},
};

function Story() {
  return (
    <div className="container flex max-w-6xl flex-col gap-8 py-10">
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
        client={storybookThirdwebClient}
        onChange={setChainIds}
      />
    </BadgeContainer>
  );
}
