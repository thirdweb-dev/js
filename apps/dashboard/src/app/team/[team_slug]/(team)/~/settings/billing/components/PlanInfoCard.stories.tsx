import type { Meta, StoryObj } from "@storybook/react";
import { addDays } from "date-fns";
import { teamStub, teamSubscriptionsStub } from "stories/stubs";
import { BadgeContainer } from "../../../../../../../../stories/utils";
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

export const Variants: Story = {
  args: {},
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

  const getBillingPortalUrlStub = async () => ({
    status: 200,
    url: "https://example.com",
  });

  return (
    <div className="container flex max-w-6xl flex-col gap-12 py-10">
      <BadgeContainer label="On-demand Subscriptions with 0 usage">
        <PlanInfoCard
          team={team}
          subscriptions={zeroUsageOnDemandSubs}
          getBillingPortalUrl={getBillingPortalUrlStub}
        />
      </BadgeContainer>

      <BadgeContainer label="Trial Plan - On-demand Subscriptions with 0 usage">
        <PlanInfoCard
          team={team}
          subscriptions={trialPlanZeroUsageOnDemandSubs}
          getBillingPortalUrl={getBillingPortalUrlStub}
        />
      </BadgeContainer>

      <BadgeContainer label="On-demand Subscriptions with 1 usage">
        <PlanInfoCard
          team={team}
          subscriptions={subsWith1Usage}
          getBillingPortalUrl={getBillingPortalUrlStub}
        />
      </BadgeContainer>

      <BadgeContainer label="On-demand Subscriptions with 4 usage">
        <PlanInfoCard
          team={team}
          subscriptions={subsWith4Usage}
          getBillingPortalUrl={getBillingPortalUrlStub}
        />
      </BadgeContainer>
    </div>
  );
}
