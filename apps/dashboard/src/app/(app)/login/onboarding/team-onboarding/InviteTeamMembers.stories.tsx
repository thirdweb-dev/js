import type { Meta, StoryObj } from "@storybook/nextjs";
import { teamStub } from "stories/stubs";
import { storybookLog, storybookThirdwebClient } from "stories/utils";
import type { Team } from "@/api/team";
import { TeamOnboardingLayout } from "../onboarding-layout";
import { InviteTeamMembersUI } from "./InviteTeamMembers";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Onboarding/TeamOnboarding/InviteTeamMembers",
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

export const AcceleratePlan: Story = {
  args: {
    plan: "accelerate",
  },
};

export const ScalePlan: Story = {
  args: {
    plan: "scale",
  },
};

export const ProPlan: Story = {
  args: {
    plan: "pro",
  },
};

function Story(props: { plan: Team["billingPlan"] }) {
  return (
    <TeamOnboardingLayout currentStep={2}>
      <InviteTeamMembersUI
        client={storybookThirdwebClient}
        getTeam={async () => {
          return teamStub("foo", props.plan);
        }}
        inviteTeamMembers={async (params) => {
          return { results: params.map(() => "fulfilled") };
        }}
        onComplete={() => {
          storybookLog("onComplete");
        }}
        team={teamStub("foo", props.plan)}
      />
    </TeamOnboardingLayout>
  );
}
