import type { Meta, StoryObj } from "@storybook/nextjs";
import { BadgeContainer } from "@/storybook/utils";
import { createUserOpStatsStub } from "./storyUtils";
import { TotalSponsoredChartCard } from "./TotalSponsoredChartCard";

const meta = {
  component: Component,
  title: "Charts/Connect/Total Sponsored",
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function Component() {
  return (
    <div className="container flex max-w-6xl flex-col gap-10 py-10">
      <BadgeContainer label="30 days">
        <TotalSponsoredChartCard
          isPending={false}
          userOpStats={createUserOpStatsStub(30)}
        />
      </BadgeContainer>

      <BadgeContainer label="60 days">
        <TotalSponsoredChartCard
          isPending={false}
          userOpStats={createUserOpStatsStub(60)}
        />
      </BadgeContainer>

      <BadgeContainer label="120 days">
        <TotalSponsoredChartCard
          isPending={false}
          userOpStats={createUserOpStatsStub(120)}
        />
      </BadgeContainer>

      <BadgeContainer label="10 days">
        <TotalSponsoredChartCard
          isPending={false}
          userOpStats={createUserOpStatsStub(10)}
        />
      </BadgeContainer>

      <BadgeContainer label="0 days">
        <TotalSponsoredChartCard
          isPending={false}
          userOpStats={createUserOpStatsStub(0)}
        />
      </BadgeContainer>

      <BadgeContainer label="Loading">
        <TotalSponsoredChartCard
          isPending={true}
          userOpStats={createUserOpStatsStub(0)}
        />
      </BadgeContainer>
    </div>
  );
}
