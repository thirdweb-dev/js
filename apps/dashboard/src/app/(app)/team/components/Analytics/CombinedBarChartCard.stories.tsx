import type { Meta, StoryObj } from "@storybook/react";
import {} from "stories/utils";
import { CombinedBarChartCard } from "./CombinedBarChartCard";

const meta = {
  title: "Analytics/CombinedBarChartCard",
  component: CombinedBarChartCard,
  decorators: [
    (Story) => (
      <div className="container max-w-6xl py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CombinedBarChartCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const chartConfig = {
  dailyUsers: {
    label: "Daily Active Users",
    color: "hsl(var(--chart-1))",
  },
  monthlyUsers: {
    label: "Monthly Active Users",
    color: "hsl(var(--chart-2))",
  },
  annualUsers: {
    label: "Annual Active Users",
    color: "hsl(var(--chart-3))",
  },
};

function generateTimeSeriesData(days: number) {
  const data = [];
  const today = new Date();

  let dailyBase = 1000;
  let monthlyBase = 5000;
  let annualBase = 30000;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Add some random variation
    const dailyVariation = Math.random() * 200 - 100;
    const monthlyVariation = Math.random() * 500 - 250;
    const annualVariation = Math.random() * 500 - 250;

    // Trend upwards slightly
    dailyBase += 10;
    monthlyBase += 50;
    annualBase += 50;

    data.push({
      date: date.toISOString(),
      dailyUsers: Math.max(0, Math.round(dailyBase + dailyVariation)),
      monthlyUsers: Math.max(0, Math.round(monthlyBase + monthlyVariation)),
      annualUsers: Math.max(0, Math.round(annualBase + annualVariation)),
    });
  }

  return data;
}

export const UserActivity: Story = {
  args: {
    title: "User Activity",
    chartConfig,
    data: generateTimeSeriesData(30),
    activeChart: "dailyUsers",
    queryKey: "dailyUsers",
  },
};

export const MonthlyUsers: Story = {
  args: {
    title: "Monthly Users",
    chartConfig,
    data: generateTimeSeriesData(30),
    activeChart: "monthlyUsers",
    queryKey: "monthlyUsers",
  },
};

export const AnnualUsers: Story = {
  args: {
    title: "Annual Users",
    chartConfig,
    data: generateTimeSeriesData(30),
    activeChart: "annualUsers",
    queryKey: "annualUsers",
  },
};
