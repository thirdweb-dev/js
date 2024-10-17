import type { Meta, StoryObj } from "@storybook/react";
import { mobileViewport } from "../../../../../../../stories/utils";
import { ConnectAnalyticsDashboardUI } from "../ConnectAnalyticsDashboardUI";
import { createUserOpStatsStub, createWalletStatsStub } from "./storyUtils";

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
        walletUsage={createWalletStatsStub(30)}
        aggregateWalletUsage={createWalletStatsStub(30)}
        userOpUsage={createUserOpStatsStub(30)}
        aggregateUserOpUsage={createUserOpStatsStub(1)}
        isPending={false}
      />
    </div>
  );
}
