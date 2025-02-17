import type { Meta, StoryObj } from "@storybook/react";
import { createUserOpStatsStub } from "components/smart-wallets/AccountAbstractionAnalytics/storyUtils";
import { getLastNDaysRange } from "../../../../../../../../components/analytics/date-range-selector";
import { mobileViewport } from "../../../../../../../../stories/utils";
import { ConnectAnalyticsDashboardUI } from "../ConnectAnalyticsDashboardUI";
import { createWalletStatsStub } from "./storyUtils";

const meta = {
  title: "Charts/Connect/Analytics Dashboard",
  component: Component,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Component>;

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

function Component() {
  return (
    <div className="container max-w-[1150px] py-8">
      <ConnectAnalyticsDashboardUI
        setRange={() => {}}
        range={getLastNDaysRange("last-120")}
        intervalType="day"
        setIntervalType={() => {}}
        walletUsage={createWalletStatsStub(30)}
        aggregateWalletUsage={createWalletStatsStub(30)}
        aggregateUserOpUsageQuery={createUserOpStatsStub(1)?.[0]}
        connectLayoutSlug="connectLayoutSlug"
        isPending={false}
      />
    </div>
  );
}
