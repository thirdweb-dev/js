import type { Meta, StoryObj } from "@storybook/nextjs";
import { subDays } from "date-fns";
import type { NebulaAnalyticsDataItem } from "./fetch-nebula-analytics";
import { NebulaAnalyticsDashboardUI } from "./nebula-analytics-ui";

const meta = {
  component: NebulaAnalyticsDashboardUI,
  decorators: [
    (Story) => (
      <div className="container max-w-6xl py-10">
        <Story />
      </div>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Nebula/Analytics",
} satisfies Meta<typeof NebulaAnalyticsDashboardUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SixtyDays: Story = {
  args: {
    data: generateRandomNebulaAnalyticsData(60),
    isPending: false,
  },
};

export const ThirtyDays: Story = {
  args: {
    data: generateRandomNebulaAnalyticsData(30),
    isPending: false,
  },
};

export const SevenDays: Story = {
  args: {
    data: generateRandomNebulaAnalyticsData(7),
    isPending: false,
  },
};

export const Pending: Story = {
  args: {
    data: [],
    isPending: true,
  },
};

function generateRandomNebulaAnalyticsData(
  days: number,
): NebulaAnalyticsDataItem[] {
  return Array.from({ length: days }, (_, i) => ({
    date: subDays(new Date(), i).toISOString(),
    totalCompletionTokens: randomInt(1000, 2000 + i * 100),
    totalPromptTokens: randomInt(500, 700 + i * 100),
    totalRequests: randomInt(4000, 5000 + i * 100),
    totalSessions: randomInt(400, 1000 + i * 100),
  }));
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
