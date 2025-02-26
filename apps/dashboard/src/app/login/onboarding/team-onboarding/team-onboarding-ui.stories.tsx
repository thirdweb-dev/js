import type { Meta, StoryObj } from "@storybook/react";
import { storybookLog } from "../../../../stories/utils";
import { TeamOnboardingUI } from "./team-onboarding-ui";

function Story() {
  return (
    <TeamOnboardingUI
      sendTeamOnboardingData={async (data) => {
        storybookLog("sendTeamOnboardingData", data);
      }}
      teamSlug="foo"
      onSkipPlan={() => {
        storybookLog("onSkipPlan");
      }}
      redirectPath="/foo"
      redirectToCheckout={async (data) => {
        storybookLog("redirectToCheckout", data);
        return { status: 200 };
      }}
    />
  );
}

const meta = {
  title: "Onboarding/TeamOnboarding/Flow",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
