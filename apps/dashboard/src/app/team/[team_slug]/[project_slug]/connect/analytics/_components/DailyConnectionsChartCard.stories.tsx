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
    <div className="gap-6 flex flex-col container py-8">
      <BadgeContainer label="30 days">
        <DailyConnectionsChartCard
          walletStats={createWalletStatsStub(30)}
          isPending={false}
        />
      </BadgeContainer>

      <BadgeContainer label="60 days">
        <DailyConnectionsChartCard
          walletStats={createWalletStatsStub(60)}
          isPending={false}
        />
      </BadgeContainer>

      <BadgeContainer label="10 days">
        <DailyConnectionsChartCard
          walletStats={createWalletStatsStub(10)}
          isPending={false}
        />
      </BadgeContainer>

      <BadgeContainer label="0 days">
        <DailyConnectionsChartCard
          walletStats={createWalletStatsStub(0)}
          isPending={false}
        />
      </BadgeContainer>

      <BadgeContainer label="Loading">
        <DailyConnectionsChartCard
          walletStats={createWalletStatsStub(0)}
          isPending={true}
        />
      </BadgeContainer>
    </div>
  );
}
