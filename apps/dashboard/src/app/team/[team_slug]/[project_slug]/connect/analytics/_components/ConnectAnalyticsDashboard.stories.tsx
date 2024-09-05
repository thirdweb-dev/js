import type { Meta, StoryObj } from "@storybook/react";
import { mobileViewport } from "../../../../../../../stories/utils";
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
    <div className="min-h-screen bg-background p-4 text-foreground gap-6 max-w-[1000px] flex flex-col mx-auto py-10">
      <ConnectAnalyticsDashboardUI
        walletStats={createWalletStatsStub(30)}
        isLoading={false}
      />
    </div>
  );
}
