import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer } from "stories/utils";
import { PieChart } from "./PieChart";

const meta = {
  title: "Analytics/PieChart",
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

const chartData = [
  { label: "Chrome", value: 275, fill: "hsl(var(--chart-1))" },
  { label: "Safari", value: 200, fill: "hsl(var(--chart-2))" },
  { label: "Firefox", value: 187, fill: "hsl(var(--chart-3))" },
  { label: "Edge", value: 173, fill: "hsl(var(--chart-4))" },
];

function Component() {
  return (
    <div className="container max-w-[400px] space-y-8 py-8">
      <BadgeContainer label="Base">
        <PieChart title="Browser Usage" data={chartData} />
      </BadgeContainer>
    </div>
  );
}
