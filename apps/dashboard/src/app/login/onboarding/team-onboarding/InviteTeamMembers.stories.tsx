import type { Meta, StoryObj } from "@storybook/react";
import { teamStub } from "../../../../stories/stubs";
import { storybookLog } from "../../../../stories/utils";
import { TeamOnboardingLayout } from "../onboarding-layout";
import { InviteTeamMembersUI } from "./InviteTeamMembers";

const meta = {
  title: "Onboarding/TeamOnboarding/InviteTeamMembers",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FreePlan: Story = {
  args: {
    plan: "free",
  },
};

// This is the case when user returns back to team onboarding flow from stripe
export const StarterPlan: Story = {
  args: {
    plan: "starter",
  },
};

export const GrowthPlan: Story = {
  args: {
    plan: "growth",
  },
};

function Story(props: {
  plan: "free" | "growth" | "starter";
}) {
  return (
    <TeamOnboardingLayout currentStep={2}>
      <InviteTeamMembersUI
        trackEvent={(params) => {
          storybookLog("trackEvent", params);
        }}
        getTeam={async () => {
          return teamStub("foo", props.plan);
        }}
        team={teamStub("foo", props.plan)}
        inviteTeamMembers={async (params) => {
          return { results: params.map(() => "fulfilled") };
        }}
        getBillingCheckoutUrl={async () => {
          return { status: 200 };
        }}
        onComplete={() => {
          storybookLog("onComplete");
        }}
      />
    </TeamOnboardingLayout>
  );
}
