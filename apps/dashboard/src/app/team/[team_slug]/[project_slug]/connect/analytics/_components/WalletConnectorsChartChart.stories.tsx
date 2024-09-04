import type { Meta, StoryObj } from "@storybook/react";
import {
  BadgeContainer,
  mobileViewport,
} from "../../../../../../../stories/utils";
import { WalletConnectorsChartCard } from "./WalletConnectorsChartCard";
import { createWalletStatusStub } from "./storyUtils";

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
    <div className="min-h-screen bg-background p-4 text-foreground gap-6 max-w-[1000px] flex flex-col mx-auto">
      <BadgeContainer label="30 days">
        <WalletConnectorsChartCard
          walletStats={createWalletStatusStub(30)}
          isLoading={false}
        />
      </BadgeContainer>

      <BadgeContainer label="60 days">
        <WalletConnectorsChartCard
          walletStats={createWalletStatusStub(60)}
          isLoading={false}
        />
      </BadgeContainer>

      <BadgeContainer label="10 days">
        <WalletConnectorsChartCard
          walletStats={createWalletStatusStub(10)}
          isLoading={false}
        />
      </BadgeContainer>

      <BadgeContainer label="0 days">
        <WalletConnectorsChartCard
          walletStats={createWalletStatusStub(0)}
          isLoading={false}
        />
      </BadgeContainer>

      <BadgeContainer label="Loading">
        <WalletConnectorsChartCard
          walletStats={createWalletStatusStub(0)}
          isLoading={true}
        />
      </BadgeContainer>
    </div>
  );
}
