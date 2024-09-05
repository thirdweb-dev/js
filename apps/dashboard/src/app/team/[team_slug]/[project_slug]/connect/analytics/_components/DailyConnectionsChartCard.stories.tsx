import type { Meta, StoryObj } from "@storybook/react";
import {
  BadgeContainer,
  mobileViewport,
} from "../../../../../../../stories/utils";
import { DailyConnectionsChartCard } from "./DailyConnectionsChartCard";
import { createWalletStatsStub } from "./storyUtils";

const meta = {
  title: "Charts/Connect/DailyConnections",
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
    <div className="min-h-screen bg-background p-4 text-foreground gap-6 max-w-[1000px] flex flex-col mx-auto">
      <BadgeContainer label="30 days">
        <DailyConnectionsChartCard
          walletStats={createWalletStatsStub(30)}
          isLoading={false}
        />
      </BadgeContainer>

      <BadgeContainer label="60 days">
        <DailyConnectionsChartCard
          walletStats={createWalletStatsStub(60)}
          isLoading={false}
        />
      </BadgeContainer>

      <BadgeContainer label="10 days">
        <DailyConnectionsChartCard
          walletStats={createWalletStatsStub(10)}
          isLoading={false}
        />
      </BadgeContainer>

      <BadgeContainer label="0 days">
        <DailyConnectionsChartCard
          walletStats={createWalletStatsStub(0)}
          isLoading={false}
        />
      </BadgeContainer>

      <BadgeContainer label="Loading">
        <DailyConnectionsChartCard
          walletStats={createWalletStatsStub(0)}
          isLoading={true}
        />
      </BadgeContainer>
    </div>
  );
}
