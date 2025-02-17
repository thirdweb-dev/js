import type { Meta, StoryObj } from "@storybook/react";
import {
  BadgeContainer,
  mobileViewport,
} from "../../../../../../../../stories/utils";
import { WalletDistributionChartCard } from "./WalletDistributionChartCard";
import { createWalletStatsStub } from "./storyUtils";

const meta = {
  title: "Charts/Connect/Wallet Distribution",
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
    <div className="container flex max-w-[1150px] flex-col gap-10 py-10">
      <BadgeContainer label="30 days">
        <WalletDistributionChartCard
          walletStats={createWalletStatsStub(30)}
          isPending={false}
        />
      </BadgeContainer>

      <BadgeContainer label="60 days">
        <WalletDistributionChartCard
          walletStats={createWalletStatsStub(60)}
          isPending={false}
        />
      </BadgeContainer>

      <BadgeContainer label="10 days">
        <WalletDistributionChartCard
          walletStats={createWalletStatsStub(10)}
          isPending={false}
        />
      </BadgeContainer>

      <BadgeContainer label="0 days">
        <WalletDistributionChartCard
          walletStats={createWalletStatsStub(0)}
          isPending={false}
        />
      </BadgeContainer>

      <BadgeContainer label="Loading">
        <WalletDistributionChartCard
          walletStats={createWalletStatsStub(0)}
          isPending={true}
        />
      </BadgeContainer>
    </div>
  );
}
