import { TabButtons } from "@/components/ui/tabs";
import type { Meta, StoryObj } from "@storybook/react";
import { subDays } from "date-fns";
import { useState } from "react";
import { mobileViewport } from "../../../../../../../stories/utils";
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
        <h2 className="mb-1 font-semibold text-xl tracking-tight">
          Story Variants
        </h2>
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
    totalPromptTokens: randomInt(1000),
    totalCompletionTokens: randomInt(1000),
    totalSessions: randomInt(100),
    totalRequests: randomInt(4000),
  }));
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}
