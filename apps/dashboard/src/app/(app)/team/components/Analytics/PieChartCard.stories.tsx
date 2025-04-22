import type { Meta, StoryObj } from "@storybook/react/*";
import { BadgeContainer } from "stories/utils";
import { PieChartCard } from "./PieChartCard";

const meta = {
  title: "Analytics/PieChartCard",
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  parameters: {
    viewport: { defaultViewport: "desktop" },
  },
};

const baseChartData = [
  { value: 275, fill: "hsl(var(--chart-1))", label: "Chrome" },
  { value: 200, fill: "hsl(var(--chart-2))", label: "Safari" },
  { value: 187, fill: "hsl(var(--chart-3))", label: "Firefox" },
  { value: 173, fill: "hsl(var(--chart-4))", label: "Edge" },
];

const manyItemsChartData = [
  { value: 275, fill: "hsl(var(--chart-1))", label: "Chrome" },
  { value: 200, fill: "hsl(var(--chart-2))", label: "Safari" },
  { value: 187, fill: "hsl(var(--chart-3))", label: "Firefox" },
  { value: 173, fill: "hsl(var(--chart-4))", label: "Edge" },
  { value: 150, fill: "hsl(var(--chart-5))", label: "Opera" },
  { value: 125, fill: "hsl(var(--chart-6))", label: "Brave" },
  { value: 100, fill: "hsl(var(--chart-7))", label: "Samsung Internet" },
  { value: 75, fill: "hsl(var(--chart-8))", label: "UC Browser" },
  { value: 50, fill: "hsl(var(--chart-9))", label: "QQ Browser" },
  { value: 40, fill: "hsl(var(--chart-10))", label: "Yandex" },
  { value: 30, fill: "hsl(var(--chart-1))", label: "Maxthon" },
  { value: 25, fill: "hsl(var(--chart-2))", label: "Vivaldi" },
  { value: 20, fill: "hsl(var(--chart-3))", label: "Tor Browser" },
  { value: 15, fill: "hsl(var(--chart-4))", label: "Pale Moon" },
];

function Component() {
  return (
    <div className="container max-w-lg space-y-8 py-10">
      <BadgeContainer label="Few Items">
        <PieChartCard title="Browser Distribution" data={baseChartData} />
      </BadgeContainer>

      <BadgeContainer label="Many Items (Shows Top 10 + Other)">
        <PieChartCard title="Browser Distribution" data={manyItemsChartData} />
      </BadgeContainer>
    </div>
  );
}
