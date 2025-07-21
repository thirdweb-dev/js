import type { Meta, StoryObj } from "@storybook/nextjs";
import { storybookLog } from "@/storybook/utils";
import { AccountOnboardingLayout } from "../onboarding-layout";
import { LinkWalletPrompt } from "./LinkWalletPrompt";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Onboarding/AccountOnboarding/LinkWalletPrompt",
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

function Story(props: { type: "success" | "error" }) {
  return (
    <AccountOnboardingLayout
      currentStep={1}
      logout={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        storybookLog("logout");
      }}
    >
      <LinkWalletPrompt
        accountAddress="0x1234567890123456789012345678901234567890"
        email="user@example.com"
        onBack={() => {
          storybookLog("onBack");
        }}
        onLinkWalletRequestSent={() => {
          storybookLog("onLinkWalletRequestSent");
        }}
        requestLinkWallet={async (email) => {
          storybookLog("requestLinkWallet", email);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (props.type === "error") {
            throw new Error("Example error");
          }
        }}
      />
    </AccountOnboardingLayout>
  );
}
