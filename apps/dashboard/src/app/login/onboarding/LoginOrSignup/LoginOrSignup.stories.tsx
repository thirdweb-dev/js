import type { UpdateAccountInput } from "@3rdweb-sdk/react/hooks/useApi";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BadgeContainer,
  mobileViewport,
  storybookLog,
} from "../../../../stories/utils";
import { LoginOrSignup } from "./LoginOrSignup";

const meta = {
  title: "Onboarding/screens/LoginOrSignup",
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

function loginOrSignupStug(
  type: "success" | "error-generic" | "error-email-exists",
) {
  return async (data: UpdateAccountInput) => {
    storybookLog("loginOrSignup", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (type === "error-generic") {
      throw new Error("Error Example");
    }

    if (type === "error-email-exists") {
      throw new Error("email address already exists");
    }
  };
}

function Story() {
  return (
    <div className="container flex max-w-[800px] flex-col gap-20 py-10">
      <Variant label="Success" type="success" />
      <Variant label="Email Exists" type="error-email-exists" />
      <Variant label="Error Generic" type="error-generic" />
    </div>
  );
}

function Variant(props: {
  label: string;
  type: "success" | "error-generic" | "error-email-exists";
}) {
  return (
    <BadgeContainer label={props.label}>
      <LoginOrSignup
        onRequestSent={(params) => {
          storybookLog("onRequestSent", params);
        }}
        loginOrSignup={loginOrSignupStug(props.type)}
        trackEvent={(params) => {
          storybookLog("trackEvent", params);
        }}
      />
    </BadgeContainer>
  );
}
