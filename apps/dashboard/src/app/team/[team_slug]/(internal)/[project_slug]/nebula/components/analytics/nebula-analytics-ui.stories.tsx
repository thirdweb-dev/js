import { TabButtons } from "@/components/ui/tabs";
import type { Meta, StoryObj } from "@storybook/react";
import { subDays } from "date-fns";
import { useState } from "react";
import { mobileViewport } from "../../../../../../../../stories/utils";
import type { NebulaAnalyticsDataItem } from "./fetch-nebula-analytics";
import { NebulaAnalyticsDashboardUI } from "./nebula-analytics-ui";

const meta = {
  title: "Nebula/Analytics",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {},
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

type VariantTab = "30-day" | "7-day" | "pending" | "60-day";

function Story() {
  const [tab, setTab] = useState<VariantTab>("60-day");
  return (
    <div className="container flex flex-col gap-8 py-10">
      <div>
        <TabButtons
          tabs={[
            {
              name: "60 Days",
              onClick: () => setTab("60-day"),
              isActive: tab === "60-day",
              isEnabled: true,
            },
            {
              name: "30 Days",
              onClick: () => setTab("30-day"),
              isActive: tab === "30-day",
              isEnabled: true,
            },
            {
              name: "7 Days",
              onClick: () => setTab("7-day"),
              isActive: tab === "7-day",
              isEnabled: true,
            },
            {
              name: "Pending",
              onClick: () => setTab("pending"),
              isActive: tab === "pending",
              isEnabled: true,
            },
          ]}
        />
      </div>

      {tab === "60-day" && (
        <NebulaAnalyticsDashboardUI
          data={generateRandomNebulaAnalyticsData(60)}
          isPending={false}
        />
      )}

      {tab === "30-day" && (
        <NebulaAnalyticsDashboardUI
          data={generateRandomNebulaAnalyticsData(30)}
          isPending={false}
        />
      )}

      {tab === "7-day" && (
        <NebulaAnalyticsDashboardUI
          data={generateRandomNebulaAnalyticsData(7)}
          isPending={false}
        />
      )}

      {tab === "pending" && (
        <NebulaAnalyticsDashboardUI data={[]} isPending={true} />
      )}
    </div>
  );
}

function generateRandomNebulaAnalyticsData(
  days: number,
): NebulaAnalyticsDataItem[] {
  return Array.from({ length: days }, (_, i) => ({
    date: subDays(new Date(), i).toISOString(),
    totalPromptTokens: randomInt(500, 700 + i * 100),
    totalCompletionTokens: randomInt(1000, 2000 + i * 100),
    totalSessions: randomInt(400, 1000 + i * 100),
    totalRequests: randomInt(4000, 5000 + i * 100),
  }));
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
