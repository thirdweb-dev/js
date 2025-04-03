import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer, mobileViewport } from "../../../stories/utils";
import { TotalSponsoredChartCard } from "./TotalSponsoredChartCard";
import { createUserOpStatsStub } from "./storyUtils";

const meta = {
  title: "Charts/Connect/Total Sponsored",
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
    <div className="container flex max-w-[1150px] flex-col gap-6 py-8">
      <BadgeContainer label="30 days">
        <TotalSponsoredChartCard
          userOpStats={createUserOpStatsStub(30)}
          isPending={false}
        />
      </BadgeContainer>

      <BadgeContainer label="60 days">
        <TotalSponsoredChartCard
          userOpStats={createUserOpStatsStub(60)}
          isPending={false}
        />
      </BadgeContainer>

      <BadgeContainer label="120 days">
        <TotalSponsoredChartCard
          userOpStats={createUserOpStatsStub(120)}
          isPending={false}
        />
      </BadgeContainer>

      <BadgeContainer label="10 days">
        <TotalSponsoredChartCard
          userOpStats={createUserOpStatsStub(10)}
          isPending={false}
        />
      </BadgeContainer>

      <BadgeContainer label="0 days">
        <TotalSponsoredChartCard
          userOpStats={createUserOpStatsStub(0)}
          isPending={false}
        />
      </BadgeContainer>

      <BadgeContainer label="Loading">
        <TotalSponsoredChartCard
          userOpStats={createUserOpStatsStub(0)}
          isPending={true}
        />
      </BadgeContainer>
    </div>
  );
}
