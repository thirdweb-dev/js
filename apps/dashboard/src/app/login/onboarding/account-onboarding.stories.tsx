import type { Meta, StoryObj } from "@storybook/nextjs";
import { newAccountStub, teamStub } from "@/storybook/stubs";
import { storybookLog } from "@/storybook/utils";
import { AccountOnboardingUI } from "./account-onboarding-ui";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Onboarding/AccountOnboarding/Flow",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewEmail: Story = {
  args: {
    loginOrSignupType: "success",
    requestLinkWalletType: "success",
    verifyEmailType: "success",
  },
};

export const EmailExists: Story = {
  args: {
    loginOrSignupType: "error-email-exists",
    requestLinkWalletType: "success",
    verifyEmailType: "success",
  },
};

function Story(props: {
  loginOrSignupType: "success" | "error-email-exists" | "error-generic";
  requestLinkWalletType: "success" | "error";
  verifyEmailType: "success" | "error";
}) {
  return (
    <AccountOnboardingUI
      accountAddress=""
      loginOrSignup={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (props.loginOrSignupType === "error-email-exists") {
          throw new Error("email address already exists");
        }

        if (props.loginOrSignupType === "error-generic") {
          throw new Error("generic error");
        }
      }}
      logout={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        storybookLog("logout");
      }}
      onComplete={() => {
        storybookLog("onComplete");
      }}
      requestLinkWallet={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (props.requestLinkWalletType === "error") {
          throw new Error("generic error");
        }
      }}
      resendEmailConfirmation={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }}
      verifyEmail={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (props.verifyEmailType === "error") {
          throw new Error("generic error");
        }

        return {
          account: newAccountStub(),
          team: teamStub("foo", "free"),
        };
      }}
    />
  );
}
