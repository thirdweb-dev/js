import type { Meta, StoryObj } from "@storybook/react";
import { newAccountStub, teamStub } from "../../../../stories/stubs";
import {
  BadgeContainer,
  mobileViewport,
  storybookLog,
} from "../../../../stories/utils";
import { VerifyEmail } from "./VerifyEmail";

const meta = {
  title: "Onboarding/screens/VerifyEmail",
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
      <Variant label="Success" type="success" />
      <Variant label="Error Generic" type="error" />
    </div>
  );
}

function Variant(props: {
  label: string;
  type: "success" | "error";
}) {
  return (
    <BadgeContainer label={props.label}>
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
    </BadgeContainer>
  );
}
