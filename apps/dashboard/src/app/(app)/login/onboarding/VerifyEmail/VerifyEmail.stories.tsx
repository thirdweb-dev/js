import type { Meta, StoryObj } from "@storybook/nextjs";
import { newAccountStub } from "stories/stubs";
import { storybookLog } from "stories/utils";
import { AccountOnboardingLayout } from "../onboarding-layout";
import { VerifyEmail } from "./VerifyEmail";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Onboarding/AccountOnboarding/VerifyEmail",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VerifyEmailSuccess: Story = {
  args: {
    resendConfirmationEmailType: "success",
    verifyEmailType: "success",
  },
};

export const VerifyEmailError: Story = {
  args: {
    resendConfirmationEmailType: "success",
    verifyEmailType: "error",
  },
};

export const ResendCodeError: Story = {
  args: {
    resendConfirmationEmailType: "error",
    verifyEmailType: "success",
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
        accountAddress="0x1234567890123456789012345678901234567890"
        email="user@example.com"
        onBack={() => {
          storybookLog("onBack");
        }}
        onEmailConfirmed={(params) => {
          storybookLog("onEmailConfirmed", params);
        }}
        resendConfirmationEmail={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (props.resendConfirmationEmailType === "error") {
            throw new Error("Example error");
          }
        }}
        title="Custom Title"
        verifyEmail={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (props.verifyEmailType === "error") {
            throw new Error("Example error");
          }
          return {
            account: newAccountStub(),
          };
        }}
      />
    </AccountOnboardingLayout>
  );
}
