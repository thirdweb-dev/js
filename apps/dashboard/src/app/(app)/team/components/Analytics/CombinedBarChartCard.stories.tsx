import type { Meta, StoryObj } from "@storybook/nextjs";
import { CombinedBarChartCard } from "./CombinedBarChartCard";

const meta = {
  component: CombinedBarChartCard,
  decorators: [
    (Story) => (
      <div className="container max-w-6xl py-10">
        <Story />
      </div>
    ),
  ],
  title: "Analytics/CombinedBarChartCard",
} satisfies Meta<typeof CombinedBarChartCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const chartConfig = {
  annualUsers: {
    color: "hsl(var(--chart-3))",
    label: "Annual Active Users",
  },
  dailyUsers: {
    color: "hsl(var(--chart-1))",
    label: "Daily Active Users",
  },
  monthlyUsers: {
    color: "hsl(var(--chart-2))",
    label: "Monthly Active Users",
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
      annualUsers: Math.max(0, Math.round(annualBase + annualVariation)),
      dailyUsers: Math.max(0, Math.round(dailyBase + dailyVariation)),
      date: date.toISOString(),
      monthlyUsers: Math.max(0, Math.round(monthlyBase + monthlyVariation)),
    });
  }

  return data;
}

export const UserActivity: Story = {
  args: {
    activeChart: "dailyUsers",
    chartConfig,
    data: generateTimeSeriesData(30),
    queryKey: "dailyUsers",
    title: "User Activity",
  },
};

export const MonthlyUsers: Story = {
  args: {
    activeChart: "monthlyUsers",
    chartConfig,
    data: generateTimeSeriesData(30),
    queryKey: "monthlyUsers",
    title: "Monthly Users",
  },
};

export const AnnualUsers: Story = {
  args: {
    activeChart: "annualUsers",
    chartConfig,
    data: generateTimeSeriesData(30),
    queryKey: "annualUsers",
    title: "Annual Users",
  },
};
