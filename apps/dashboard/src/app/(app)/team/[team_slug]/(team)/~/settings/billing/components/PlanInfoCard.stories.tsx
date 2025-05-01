import type { Team } from "@/api/team";
import type { Meta, StoryObj } from "@storybook/react";
import { addDays } from "date-fns";
import { teamStub, teamSubscriptionsStub } from "stories/stubs";
import { BadgeContainer } from "stories/utils";
import { PlanInfoCardUI } from "./PlanInfoCard";

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

export const Free: Story = {
  args: {
    plan: "free",
  },
};

export const StarterLegacy: Story = {
  args: {
    plan: "starter_legacy",
  },
};

export const Starter: Story = {
  args: {
    plan: "starter",
  },
};

export const GrowthLegacy: Story = {
  args: {
    plan: "growth_legacy",
  },
};

export const Growth: Story = {
  args: {
    plan: "growth",
  },
};

export const Accelerate: Story = {
  args: {
    plan: "accelerate",
  },
};

export const Scale: Story = {
  args: {
    plan: "scale",
  },
};

export const Pro: Story = {
  args: {
    plan: "pro",
  },
};

function Story(props: {
  plan: Team["billingPlan"];
}) {
  const team = teamStub("foo", props.plan);
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

  const teamTeamStub = async () =>
    ({
      ...team,
      billingPlan: "free",
    }) satisfies Team;

  return (
    <div className="container flex max-w-6xl flex-col gap-12 py-10">
      <BadgeContainer label="On-demand Subscriptions with 0 usage">
        <PlanInfoCardUI
          team={team}
          subscriptions={zeroUsageOnDemandSubs}
          getTeam={teamTeamStub}
        />
      </BadgeContainer>

      <BadgeContainer label="Scheduled to cancel in 10 days">
        <PlanInfoCardUI
          team={{
            ...team,
            planCancellationDate: addDays(new Date(), 10).toISOString(),
          }}
          subscriptions={zeroUsageOnDemandSubs}
          getTeam={teamTeamStub}
        />
      </BadgeContainer>

      <BadgeContainer label="Trial Plan - On-demand Subscriptions with 0 usage">
        <PlanInfoCardUI
          team={team}
          subscriptions={trialPlanZeroUsageOnDemandSubs}
          getTeam={teamTeamStub}
        />
      </BadgeContainer>

      <BadgeContainer label="On-demand Subscriptions with 1 usage">
        <PlanInfoCardUI
          team={team}
          subscriptions={subsWith1Usage}
          getTeam={teamTeamStub}
        />
      </BadgeContainer>

      <BadgeContainer label="On-demand Subscriptions with 4 usage">
        <PlanInfoCardUI
          team={team}
          subscriptions={subsWith4Usage}
          getTeam={teamTeamStub}
        />
      </BadgeContainer>
    </div>
  );
}
