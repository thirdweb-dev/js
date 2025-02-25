import type { Meta, StoryObj } from "@storybook/react";
import { newAccountStub, teamStub } from "../../../stories/stubs";
import {
  BadgeContainer,
  mobileViewport,
  storybookLog,
} from "../../../stories/utils";
import Onboarding from "./on-boarding-ui";

const meta = {
  title: "Onboarding/Flow",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {},
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Story() {
  return (
    <div className="container flex max-w-[800px] flex-col gap-20 py-10">
      {/* Send Email */}
      <Variant
        label="New Email"
        loginOrSignupType="success"
        requestLinkWalletType="success"
        verifyEmailType="success"
      />

      <Variant
        label="New Email, Verify Email Fails"
        loginOrSignupType="success"
        requestLinkWalletType="success"
        verifyEmailType="error"
      />

      <Variant
        label="Email Exists"
        loginOrSignupType="error-email-exists"
        requestLinkWalletType="success"
        verifyEmailType="success"
      />

      <Variant
        label="Email Exists, Link Wallet Verify Email Fails"
        loginOrSignupType="error-email-exists"
        requestLinkWalletType="success"
        verifyEmailType="error"
      />
    </div>
  );
}

function Variant(props: {
  label: string;
  loginOrSignupType: "success" | "error-email-exists" | "error-generic";
  requestLinkWalletType: "success" | "error";
  verifyEmailType: "success" | "error";
}) {
  return (
    <BadgeContainer label={props.label}>
      <Onboarding
        shouldSkipEmailOnboarding={false}
        redirectPath=""
        redirectToCheckout={() => Promise.resolve({ status: 200 })}
        skipOnboarding={() => {
          storybookLog("skipOnboarding");
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
        sendTeamOnboardingData={async (params) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          storybookLog("sendTeamOnboardingData", params);
        }}
      />
    </BadgeContainer>
  );
}
