import type { Meta, StoryObj } from "@storybook/nextjs";
import { useMemo, useState } from "react";
import { BadgeContainer } from "../../../stories/utils";
import { MultiSelect } from "./multi-select";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "blocks/MultiSelect",
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
      <VariantTest defaultValues={[]} listLen={5} storyLabel="5 items" />
      <VariantTest defaultValues={[]} listLen={5000} storyLabel="5000 items" />
      <VariantTest
        defaultValues={["1", "3", "5"]}
        listLen={20}
        storyLabel="20 items, 3 selected by default"
      />
      <VariantTest
        defaultValues={["1", "2", "3", "4", "5", "6", "7"]}
        listLen={20}
        maxCount={3}
        storyLabel="20 items, 7 selected, show max 3"
      />
    </div>
  );
}

function VariantTest(props: {
  defaultValues: string[];
  maxCount?: number;
  storyLabel: string;
  listLen: number;
}) {
  const list = useMemo(() => createList(props.listLen), [props.listLen]);
  const [values, setValues] = useState<string[]>(props.defaultValues);

  return (
    <BadgeContainer label={props.storyLabel}>
      <MultiSelect
        maxCount={props.maxCount}
        onSelectedValuesChange={(values) => {
          setValues(values);
        }}
        options={list}
        placeholder="Select items"
        selectedValues={values}
      />
    </BadgeContainer>
  );
}
