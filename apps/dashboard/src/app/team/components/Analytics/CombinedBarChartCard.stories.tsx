import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer, mobileViewport } from "stories/utils";
import { CombinedBarChartCard } from "./CombinedBarChartCard";

const meta = {
  title: "Analytics/CombinedBarChartCard",
  component: Component,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export const Mobile: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    viewport: mobileViewport("iphone14"),
  },
};

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

const generateTimeSeriesData = (days: number) => {
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
};

function Component() {
  return (
    <div className="max-w-[1000px] space-y-8 py-8 md:container">
      <BadgeContainer label="Daily Users View">
        <CombinedBarChartCard
          title="User Activity"
          chartConfig={chartConfig}
          data={generateTimeSeriesData(30)}
          activeChart="dailyUsers"
          queryKey="dailyUsers"
        />
      </BadgeContainer>

      <BadgeContainer label="Monthly Users View">
        <CombinedBarChartCard
          title="User Activity"
          chartConfig={chartConfig}
          data={generateTimeSeriesData(30)}
          activeChart="monthlyUsers"
          queryKey="monthlyUsers"
        />
      </BadgeContainer>
    </div>
  );
}
