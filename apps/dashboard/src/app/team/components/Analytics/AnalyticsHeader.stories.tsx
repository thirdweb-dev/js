import type { Meta, StoryObj } from "@storybook/react";
import { getLastNDaysRange } from "components/analytics/date-range-selector";
import { BadgeContainer, mobileViewport } from "stories/utils";
import { AnalyticsHeader } from "./AnalyticsHeader";

const meta = {
  title: "Analytics/AnalyticsHeader",
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

function Component() {
  return (
    <div className="container py-8">
      <BadgeContainer label="Base">
        <AnalyticsHeader
          title="Project Overview"
          interval="day"
          range={getLastNDaysRange("last-120")}
          showRangeSelector={true}
        />
      </BadgeContainer>
    </div>
  );
}
