import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toaster } from "sonner";
import { BadgeContainer, mobileViewport } from "../../../../stories/utils";
import type { ContextFilters } from "../api/chat";
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
      <Variant contextFilters={undefined} label="No Filters Set" />
      <Variant
        contextFilters={{
          chainIds: ["1", "2", "3"],
        }}
        label="Chain ids Set"
      />

      <Variant
        contextFilters={{
          contractAddresses: ["0x1E51e33F9838A5a043E099C60409f62aA564272f"],
        }}
        label="Contract addresses set"
      />
      <Toaster richColors />
    </div>
  );
}

function Variant(props: {
  label: string;
  contextFilters: ContextFilters | undefined;
}) {
  const [contextFilters, setContextFilters] = useState<
    ContextFilters | undefined
  >(props.contextFilters);
  return (
    <BadgeContainer label={props.label}>
      <ContextFiltersButton
        contextFilters={contextFilters}
        setContextFilters={setContextFilters}
        updateContextFilters={async (values) => {
          console.log("Updating context filters", values);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      />
    </BadgeContainer>
  );
}
