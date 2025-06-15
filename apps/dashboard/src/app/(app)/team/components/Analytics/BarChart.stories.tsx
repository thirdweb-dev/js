import type { Meta, StoryObj } from "@storybook/nextjs";
import { BadgeContainer } from "stories/utils";
import { BarChart } from "./BarChart";

const meta = {
  title: "Analytics/BarChart",
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

const chartConfig = {
  views: {
    label: "Daily Views",
    color: "hsl(var(--chart-1))",
  },
  users: {
    label: "Active Users",
    color: "hsl(var(--chart-2))",
  },
};

const generateDailyData = (days: number) => {
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString(),
      views: Math.floor(Math.random() * 1000) + 500,
      users: Math.floor(Math.random() * 800) + 200,
    });
  }

  return data;
};

function Component() {
  return (
    <div className="container max-w-[800px] space-y-8 py-8">
      <BadgeContainer label="Views Data">
        <BarChart
          tooltipLabel="Daily Views"
          chartConfig={chartConfig}
          data={generateDailyData(14)}
          activeKey="views"
        />
      </BadgeContainer>

      <BadgeContainer label="Users Data">
        <BarChart
          tooltipLabel="Active Users"
          chartConfig={chartConfig}
          data={generateDailyData(14)}
          activeKey="users"
        />
      </BadgeContainer>
    </div>
  );
}
