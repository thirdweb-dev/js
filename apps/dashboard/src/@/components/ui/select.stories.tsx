import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer } from "../../../stories/utils";

const meta = {
  title: "Shadcn/Select",
  component: Component,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: {},
};

function randomName() {
  return Math.random().toString(36).substring(7);
}

function Component() {
  return (
    <div className="flex min-h-dvh flex-col gap-10 bg-background p-6 text-foreground">
      <BadgeContainer label="5 items, no placeholder, no label, value filled">
        <SelectDemo listItems={5} selectFirst />
      </BadgeContainer>

      <BadgeContainer label="50 items, no placeholder, no label, value filled">
        <SelectDemo listItems={50} selectFirst />
      </BadgeContainer>

      <BadgeContainer label="5 items, no placeholder, no label, no value">
        <SelectDemo listItems={5} />
      </BadgeContainer>

      <BadgeContainer label="5 items, placeholder, no label, no value">
        <SelectDemo listItems={5} placeholder="some placeholder" />
      </BadgeContainer>
    </div>
  );
}

function SelectDemo(props: {
  listItems: number;
  placeholder?: string;
  label?: string;
  selectFirst?: boolean;
}) {
  const listItems = Array.from({ length: props.listItems }, () => randomName());

  return (
    <Select value={props.selectFirst ? listItems[0] : undefined}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {props.label && <SelectLabel> {props.label}</SelectLabel>}

          {listItems.map((item) => {
            return (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
