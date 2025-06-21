import type { Meta, StoryObj } from "@storybook/nextjs";
import { BadgeContainer } from "../../../stories/utils";
import { SponsoredTransactionsChartCard } from "./SponsoredTransactionsChartCard";
import { createUserOpStatsStub } from "./storyUtils";

const meta = {
  component: Component,
  title: "Charts/Connect/Sponsored Transactions",
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
          isPending={false}
          userOpStats={createUserOpStatsStub(30)}
        />
      </BadgeContainer>

      <BadgeContainer label="60 days">
        <SponsoredTransactionsChartCard
          isPending={false}
          userOpStats={createUserOpStatsStub(60)}
        />
      </BadgeContainer>

      <BadgeContainer label="10 days">
        <SponsoredTransactionsChartCard
          isPending={false}
          userOpStats={createUserOpStatsStub(10)}
        />
      </BadgeContainer>

      <BadgeContainer label="0 days">
        <SponsoredTransactionsChartCard
          isPending={false}
          userOpStats={createUserOpStatsStub(0)}
        />
      </BadgeContainer>

      <BadgeContainer label="Loading">
        <SponsoredTransactionsChartCard
          isPending={true}
          userOpStats={createUserOpStatsStub(0)}
        />
      </BadgeContainer>
    </div>
  );
}
