import type { Meta, StoryObj } from "@storybook/react";
import { newAccountStub, teamStub } from "../../../../stories/stubs";
import { storybookLog } from "../../../../stories/utils";
import { OnboardingLayout } from "../onboarding-layout";
import { VerifyEmail } from "./VerifyEmail";

const meta = {
  title: "Onboarding/AccountOnboarding/VerifyEmail",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VerifyEmailSuccess: Story = {
  args: {
    type: "success",
  },
};

export const VerifyEmailError: Story = {
  args: {
    type: "error",
  },
};

function Story(props: {
  type: "success" | "error";
}) {
  return (
    <OnboardingLayout currentStep={2}>
      <VerifyEmail
        title="Custom Title"
        trackingAction="customAction"
        accountAddress="0x1234567890123456789012345678901234567890"
        verifyEmail={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (props.type === "error") {
            throw new Error("Example error");
          }
          return {
            team: teamStub("foo", "free"),
            account: newAccountStub(),
          };
        }}
        resendConfirmationEmail={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (props.type === "error") {
            throw new Error("Example error");
          }
        }}
        email="user@example.com"
        onEmailConfirmed={(params) => {
          storybookLog("onEmailConfirmed", params);
        }}
        onBack={() => {
          storybookLog("onBack");
        }}
        trackEvent={(params) => {
          storybookLog("trackEvent", params);
        }}
      />
    </OnboardingLayout>
  );
}
