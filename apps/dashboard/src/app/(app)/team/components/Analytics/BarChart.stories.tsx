import type { Meta, StoryObj } from "@storybook/nextjs";
import { BadgeContainer } from "@/storybook/utils";
import { BarChart } from "./BarChart";

const meta = {
  component: Component,
  title: "Analytics/BarChart",
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
  users: {
    color: "hsl(var(--chart-2))",
    label: "Active Users",
  },
  views: {
    color: "hsl(var(--chart-1))",
    label: "Daily Views",
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
      users: Math.floor(Math.random() * 800) + 200,
      views: Math.floor(Math.random() * 1000) + 500,
    });
  }

  return data;
};

function Component() {
  return (
    <div className="container max-w-[800px] space-y-8 py-8">
      <BadgeContainer label="Views Data">
        <BarChart
          activeKey="views"
          chartConfig={chartConfig}
          data={generateDailyData(14)}
          tooltipLabel="Daily Views"
        />
      </BadgeContainer>

      <BadgeContainer label="Users Data">
        <BarChart
          activeKey="users"
          chartConfig={chartConfig}
          data={generateDailyData(14)}
          tooltipLabel="Active Users"
        />
      </BadgeContainer>
    </div>
  );
}
