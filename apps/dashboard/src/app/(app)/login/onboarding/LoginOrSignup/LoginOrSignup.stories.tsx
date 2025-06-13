import type { Meta, StoryObj } from "@storybook/nextjs";
import { storybookLog } from "stories/utils";
import { AccountOnboardingLayout } from "../onboarding-layout";
import { LoginOrSignup } from "./LoginOrSignup";

const meta = {
  title: "Onboarding/AccountOnboarding/LoginOrSignup",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    type: "success",
  },
};

export const EmailExists: Story = {
  args: {
    type: "email-exists",
  },
};

export const OtherError: Story = {
  args: {
    type: "error",
  },
};

function Story(props: {
  type: "success" | "error" | "email-exists";
}) {
  return (
    <AccountOnboardingLayout
      currentStep={1}
      logout={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        storybookLog("logout");
      }}
    >
      <LoginOrSignup
        onRequestSent={(params) => {
          storybookLog("onRequestSent", params);
        }}
        loginOrSignup={async (data) => {
          storybookLog("loginOrSignup", data);

          await new Promise((resolve) => setTimeout(resolve, 1000));

          if (props.type === "error") {
            throw new Error("Error Example");
          }

          if (props.type === "email-exists") {
            throw new Error("email address already exists");
          }
        }}
      />
    </AccountOnboardingLayout>
  );
}
