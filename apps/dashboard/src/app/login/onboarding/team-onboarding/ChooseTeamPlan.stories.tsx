import type { Meta, StoryObj } from "@storybook/react";
import { TeamOnboardingLayout } from "../onboarding-layout";
import { ChooseTeamPlan } from "./ChooseTeamPlan";

const meta = {
  title: "Onboarding/TeamOnboarding/ChoosePlan",
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
  return (
    <TeamOnboardingLayout currentStep={2}>
      <ChooseTeamPlan
        skipPlan={async () => {}}
        teamSlug="test"
        redirectPath="/"
        redirectToCheckout={async () => {
          return { status: 200 };
        }}
      />
    </TeamOnboardingLayout>
  );
}
