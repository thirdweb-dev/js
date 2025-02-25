import type { UpdateAccountParams } from "@3rdweb-sdk/react/hooks/useApi";
import type { Meta, StoryObj } from "@storybook/react";
import { storybookLog } from "../../../../stories/utils";
import { OnboardingLayout } from "../onboarding-layout";
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

export const ConfiramtionError: Story = {
  args: {
    type: "error",
  },
};

function loginOrSignupStug(type: "success" | "error" | "email-exists") {
  return async (data: UpdateAccountParams) => {
    storybookLog("loginOrSignup", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (type === "error") {
      throw new Error("Error Example");
    }

    if (type === "email-exists") {
      throw new Error("email address already exists");
    }
  };
}

function Story(props: {
  type: "success" | "error" | "email-exists";
}) {
  return (
    <OnboardingLayout currentStep={1}>
      <LoginOrSignup
        onRequestSent={(params) => {
          storybookLog("onRequestSent", params);
        }}
        loginOrSignup={loginOrSignupStug(props.type)}
        trackEvent={(params) => {
          storybookLog("trackEvent", params);
        }}
      />
    </OnboardingLayout>
  );
}
