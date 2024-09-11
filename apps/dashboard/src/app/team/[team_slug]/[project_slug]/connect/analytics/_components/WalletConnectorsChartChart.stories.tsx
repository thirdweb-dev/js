import type { Meta, StoryObj } from "@storybook/react";
import {
  BadgeContainer,
  mobileViewport,
} from "../../../../../../../stories/utils";
import { WalletConnectorsChartCard } from "./WalletConnectorsChartCard";
import { createWalletStatsStub } from "./storyUtils";

const meta = {
  title: "Charts/Connect/Wallet Connectors",
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
    <div className="container flex flex-col gap-10 py-10">
      <BadgeContainer label="30 days">
        <WalletConnectorsChartCard
          walletStats={createWalletStatsStub(30)}
          isLoading={false}
        />
      </BadgeContainer>

      <BadgeContainer label="60 days">
        <WalletConnectorsChartCard
          walletStats={createWalletStatsStub(60)}
          isLoading={false}
        />
      </BadgeContainer>

      <BadgeContainer label="10 days">
        <WalletConnectorsChartCard
          walletStats={createWalletStatsStub(10)}
          isLoading={false}
        />
      </BadgeContainer>

      <BadgeContainer label="0 days">
        <WalletConnectorsChartCard
          walletStats={createWalletStatsStub(0)}
          isLoading={false}
        />
      </BadgeContainer>

      <BadgeContainer label="Loading">
        <WalletConnectorsChartCard
          walletStats={createWalletStatsStub(0)}
          isLoading={true}
        />
      </BadgeContainer>
    </div>
  );
}
