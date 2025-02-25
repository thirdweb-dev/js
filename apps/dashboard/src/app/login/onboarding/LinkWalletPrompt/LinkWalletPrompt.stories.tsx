import type { Meta, StoryObj } from "@storybook/react";
import { storybookLog } from "../../../../stories/utils";
import { OnboardingLayout } from "../onboarding-layout";
import { LinkWalletPrompt } from "./LinkWalletPrompt";

const meta = {
  title: "Onboarding/AccountOnboarding/LinkWalletPrompt",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SendSuccess: Story = {
  args: {
    type: "success",
  },
};

export const SendError: Story = {
  args: {
    type: "error",
  },
};

function Story(props: {
  type: "success" | "error";
}) {
  return (
    <OnboardingLayout currentStep={1}>
      <LinkWalletPrompt
        onLinkWalletRequestSent={() => {
          storybookLog("onLinkWalletRequestSent");
        }}
        email="user@example.com"
        requestLinkWallet={async (email) => {
          storybookLog("linkWallet", email);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (props.type === "error") {
            throw new Error("Example error");
          }
        }}
        onBack={() => {
          storybookLog("onBack");
        }}
        trackEvent={(params) => {
          storybookLog("trackEvent", params);
        }}
        accountAddress="0x1234567890123456789012345678901234567890"
      />
    </OnboardingLayout>
  );
}
