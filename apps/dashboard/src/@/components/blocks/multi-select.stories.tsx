import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import { BadgeContainer } from "../../../stories/utils";
import { MultiSelect } from "./multi-select";

const meta = {
  title: "blocks/MultiSelect",
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
      <VariantTest defaultValues={[]} storyLabel="5 items" listLen={5} />
      <VariantTest defaultValues={[]} storyLabel="5000 items" listLen={5000} />
      <VariantTest
        defaultValues={["1", "3", "5"]}
        storyLabel="20 items, 3 selected by default"
        listLen={20}
      />
      <VariantTest
        defaultValues={["1", "2", "3", "4", "5", "6", "7"]}
        storyLabel="20 items, 7 selected, show max 3"
        listLen={20}
        maxCount={3}
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
        selectedValues={values}
        options={list}
        onSelectedValuesChange={(values) => {
          setValues(values);
        }}
        placeholder="Select items"
        maxCount={props.maxCount}
      />
    </BadgeContainer>
  );
}
