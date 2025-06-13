import type { Meta, StoryObj } from "@storybook/nextjs";
import { newAccountStub } from "stories/stubs";
import { storybookLog } from "stories/utils";
import { AccountOnboardingLayout } from "../onboarding-layout";
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
    verifyEmailType: "success",
    resendConfirmationEmailType: "success",
  },
};

export const VerifyEmailError: Story = {
  args: {
    verifyEmailType: "error",
    resendConfirmationEmailType: "success",
  },
};

export const ResendCodeError: Story = {
  args: {
    verifyEmailType: "success",
    resendConfirmationEmailType: "error",
  },
};

function Story(props: {
  verifyEmailType: "success" | "error";
  resendConfirmationEmailType: "success" | "error";
}) {
  return (
    <AccountOnboardingLayout
      currentStep={2}
      logout={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        storybookLog("logout");
      }}
    >
      <VerifyEmail
        title="Custom Title"
        trackingAction="customAction"
        accountAddress="0x1234567890123456789012345678901234567890"
        verifyEmail={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (props.verifyEmailType === "error") {
            throw new Error("Example error");
          }
          return {
            account: newAccountStub(),
          };
        }}
        resendConfirmationEmail={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (props.resendConfirmationEmailType === "error") {
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
      />
    </AccountOnboardingLayout>
  );
}
