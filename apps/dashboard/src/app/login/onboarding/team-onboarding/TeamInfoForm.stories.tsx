import { Toaster } from "@/components/ui/sonner";
import type { Meta, StoryObj } from "@storybook/react";
import { storybookLog } from "../../../../stories/utils";
import { TeamOnboardingLayout } from "../onboarding-layout";
import { TeamInfoForm } from "./TeamInfoForm";

const meta = {
  title: "Onboarding/TeamOnboarding/TeamInfo",
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
    sendType: "success",
  },
};

export const SendError: Story = {
  args: {
    sendType: "error",
  },
};

function Story(props: {
  sendType: "success" | "error";
}) {
  return (
    <TeamOnboardingLayout currentStep={1}>
      <TeamInfoForm
        onComplete={() => {
          storybookLog("onComplete");
        }}
        sendTeamOnboardingData={async (formData) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          storybookLog("sendTeamOnboardingData", formData);
          if (props.sendType === "error") {
            throw new Error("Demo Error");
          }
        }}
      />
      <Toaster richColors />
    </TeamOnboardingLayout>
  );
}
