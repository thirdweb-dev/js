import type { Meta, StoryObj } from "@storybook/react";
import { addDays } from "date-fns";
import { teamStub, teamSubscriptionsStub } from "stories/stubs";
import {
  BadgeContainer,
  mobileViewport,
} from "../../../../../../../../stories/utils";
import { PlanInfoCard } from "./PlanInfoCard";

const meta = {
  title: "Billing/PlanInfoCard",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

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

function Story() {
  const team = teamStub("foo", "growth");
  const zeroUsageOnDemandSubs = teamSubscriptionsStub("plan:growth");
  const trialPlanZeroUsageOnDemandSubs = teamSubscriptionsStub("plan:growth", {
    trialEnd: addDays(new Date(), 7).toISOString(),
  });

  const subsWith1Usage = teamSubscriptionsStub("plan:growth", {
    usage: {
      storage: {
        amount: 10000,
        quantity: 4,
      },
    },
  });

  const subsWith4Usage = teamSubscriptionsStub("plan:growth", {
    usage: {
      storage: {
        amount: 10000,
        quantity: 4,
      },
      aaSponsorshipAmount: {
        amount: 7500,
        quantity: 4,
      },
      aaSponsorshipOpGrantAmount: {
        amount: 2500,
        quantity: 4,
      },
      inAppWalletAmount: {
        amount: 40000,
        quantity: 100,
      },
    },
  });

  return (
    <div className="container flex max-w-[1130px] flex-col gap-12 lg:p-10">
      <BadgeContainer label="On-demand Subscriptions with 0 usage">
        <PlanInfoCard team={team} subscriptions={zeroUsageOnDemandSubs} />
      </BadgeContainer>

      <BadgeContainer label="Trial Plan - On-demand Subscriptions with 0 usage">
        <PlanInfoCard
          team={team}
          subscriptions={trialPlanZeroUsageOnDemandSubs}
        />
      </BadgeContainer>

      <BadgeContainer label="On-demand Subscriptions with 1 usage">
        <PlanInfoCard team={team} subscriptions={subsWith1Usage} />
      </BadgeContainer>

      <BadgeContainer label="On-demand Subscriptions with 4 usage">
        <PlanInfoCard team={team} subscriptions={subsWith4Usage} />
      </BadgeContainer>
    </div>
  );
}
