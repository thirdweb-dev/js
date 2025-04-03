import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer } from "../../../stories/utils";
import { SponsoredTransactionsChartCard } from "./SponsoredTransactionsChartCard";
import { createUserOpStatsStub } from "./storyUtils";

const meta = {
  title: "Charts/Connect/Sponsored Transactions",
  component: Component,
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
        <SponsoredTransactionsChartCard
          userOpStats={createUserOpStatsStub(30)}
          isPending={false}
        />
      </BadgeContainer>

      <BadgeContainer label="60 days">
        <SponsoredTransactionsChartCard
          userOpStats={createUserOpStatsStub(60)}
          isPending={false}
        />
      </BadgeContainer>

      <BadgeContainer label="10 days">
        <SponsoredTransactionsChartCard
          userOpStats={createUserOpStatsStub(10)}
          isPending={false}
        />
      </BadgeContainer>

      <BadgeContainer label="0 days">
        <SponsoredTransactionsChartCard
          userOpStats={createUserOpStatsStub(0)}
          isPending={false}
        />
      </BadgeContainer>

      <BadgeContainer label="Loading">
        <SponsoredTransactionsChartCard
          userOpStats={createUserOpStatsStub(0)}
          isPending={true}
        />
      </BadgeContainer>
    </div>
  );
}
