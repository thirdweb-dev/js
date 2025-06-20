import type { Meta, StoryObj } from "@storybook/nextjs";
import { BadgeContainer } from "stories/utils";
import { PieChart } from "./PieChart";

const meta = {
  component: Component,
  title: "Analytics/PieChart",
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

const chartData = [
  { fill: "hsl(var(--chart-1))", label: "Chrome", value: 275 },
  { fill: "hsl(var(--chart-2))", label: "Safari", value: 200 },
  { fill: "hsl(var(--chart-3))", label: "Firefox", value: 187 },
  { fill: "hsl(var(--chart-4))", label: "Edge", value: 173 },
];

function Component() {
  return (
    <div className="container max-w-[400px] space-y-8 py-8">
      <BadgeContainer label="Base">
        <PieChart data={chartData} title="Browser Usage" />
      </BadgeContainer>
    </div>
  );
}
