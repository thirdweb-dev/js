import type { Meta, StoryObj } from "@storybook/nextjs";
import { useMemo, useState } from "react";
import { BadgeContainer } from "@/storybook/utils";
import { SelectWithSearch } from "./select-with-search";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "blocks/SelectWithSearch",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function createList(len: number) {
  return Array.from({ length: len }, (_, i) => ({
    label: `Item ${i}`,
    value: `${i}`,
  }));
}

function Story() {
  return (
    <div className="container flex max-w-6xl flex-col gap-6 py-10">
      <VariantTest listLen={5} storyLabel="5 items" />
      <VariantTest listLen={5000} storyLabel="5000 items" />
      <VariantTest
        defaultValue={"3"}
        listLen={20}
        storyLabel="20 items, 3 selected by default"
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
        onValueChange={setValue}
        options={list}
        placeholder="Select items"
        value={value}
      />
    </BadgeContainer>
  );
}
