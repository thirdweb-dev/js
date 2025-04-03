import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import { BadgeContainer } from "../../../stories/utils";
import { SelectWithSearch } from "./select-with-search";

const meta = {
  title: "blocks/SelectWithSearch",
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

function createList(len: number) {
  return Array.from({ length: len }, (_, i) => ({
    value: `${i}`,
    label: `Item ${i}`,
  }));
}

function Story() {
  return (
    <div className="container flex max-w-6xl flex-col gap-6 py-10">
      <VariantTest storyLabel="5 items" listLen={5} />
      <VariantTest storyLabel="5000 items" listLen={5000} />
      <VariantTest
        defaultValue={"3"}
        storyLabel="20 items, 3 selected by default"
        listLen={20}
      />
    </div>
  );
}

function VariantTest(props: {
  defaultValue?: string;
  storyLabel: string;
  listLen: number;
}) {
  const list = useMemo(() => createList(props.listLen), [props.listLen]);
  const [value, setValue] = useState<string | undefined>(props.defaultValue);

  return (
    <BadgeContainer label={props.storyLabel}>
      <SelectWithSearch
        value={value}
        options={list}
        onValueChange={setValue}
        placeholder="Select items"
      />
    </BadgeContainer>
  );
}
