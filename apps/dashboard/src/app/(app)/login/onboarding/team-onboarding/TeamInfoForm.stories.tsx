import type { Meta, StoryObj } from "@storybook/nextjs";
import { teamStub } from "stories/stubs";
import { storybookLog, storybookThirdwebClient } from "stories/utils";
import { TeamOnboardingLayout } from "../onboarding-layout";
import { TeamInfoFormUI } from "./TeamInfoForm";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Onboarding/TeamOnboarding/TeamInfo",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SendSuccess: Story = {
  args: {
    sendType: "success",
  },
};

export const SendError: Story = {
  args: {
    sendType: "error",
  },
};

function Story(props: { sendType: "success" | "error" }) {
  return (
    <TeamOnboardingLayout currentStep={1}>
      <TeamInfoFormUI
        client={storybookThirdwebClient}
        isTeamSlugAvailable={async (slug) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          // taken slugs stub
          if (slug === "xyz" || slug === "abc" || slug === "xyz-1") {
            return false;
          }

          return true;
        }}
        onComplete={() => {
          storybookLog("onComplete");
        }}
        teamSlug="foo"
        updateTeam={async (formData) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          storybookLog("updateTeam", formData);
          if (props.sendType === "error") {
            throw new Error("Test Error");
          }

          return teamStub("foo", "free");
        }}
      />
    </TeamOnboardingLayout>
  );
}
