import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BadgeContainer, storybookLog } from "../../../../stories/utils";
import type { NebulaContext } from "../api/chat";
import ContextFiltersButton from "./ContextFilters";

const meta = {
  title: "Nebula/ContextFilters",
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
      <Variant contextFilters={undefined} label="No Filters Set" />

      <Variant
        contextFilters={{
          chainIds: ["137"],
          walletAddress: null,
        }}
        label="1 chain"
      />

      <Variant
        contextFilters={{
          chainIds: ["137", "10", "421614"],
          walletAddress: null,
        }}
        label="Few chains"
      />

      <Variant
        contextFilters={{
          walletAddress: "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
          chainIds: null,
        }}
        label="1 wallet"
      />

      <Variant
        contextFilters={{
          chainIds: ["137", "10", "421614"],
          walletAddress: "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
        }}
        label="chains + wallet"
      />
    </div>
  );
}

function Variant(props: {
  label: string;
  contextFilters: NebulaContext | undefined;
}) {
  const [contextFilters, setContextFilters] = useState<
    NebulaContext | undefined
  >(props.contextFilters);
  return (
    <BadgeContainer label={props.label}>
      <ContextFiltersButton
        contextFilters={contextFilters}
        setContextFilters={setContextFilters}
        updateContextFilters={async (values) => {
          storybookLog("Updating context", values);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      />
    </BadgeContainer>
  );
}
