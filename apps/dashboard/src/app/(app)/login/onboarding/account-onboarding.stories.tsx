import type { Meta, StoryObj } from "@storybook/nextjs";
import { newAccountStub, teamStub } from "../../../../stories/stubs";
import { storybookLog } from "../../../../stories/utils";
import { AccountOnboardingUI } from "./account-onboarding-ui";

const meta = {
  title: "Onboarding/AccountOnboarding/Flow",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
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
      logout={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        storybookLog("logout");
      }}
      onComplete={() => {
        storybookLog("onComplete");
      }}
      accountAddress=""
      trackEvent={(params) => {
        storybookLog("trackEvent", params);
      }}
      loginOrSignup={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (props.loginOrSignupType === "error-email-exists") {
          throw new Error("email address already exists");
        }

        if (props.loginOrSignupType === "error-generic") {
          throw new Error("generic error");
        }
      }}
      requestLinkWallet={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (props.requestLinkWalletType === "error") {
          throw new Error("generic error");
        }
      }}
      verifyEmail={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (props.verifyEmailType === "error") {
          throw new Error("generic error");
        }

        return {
          team: teamStub("foo", "free"),
          account: newAccountStub(),
        };
      }}
      resendEmailConfirmation={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }}
    />
  );
}
