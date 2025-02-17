import type { Meta, StoryObj } from "@storybook/react";
import { mobileViewport } from "../../../stories/utils";
import { TeamInfoOnboarding } from "./TeamInfoOnboarding";

const meta = {
  title: "Onboarding/screens/TeamInfoOnboarding",
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
      <TeamInfoOnboarding
        onComplete={(params) => {
          console.log("onComplete", params);
        }}
        sendTeamOnboardingData={async (formData) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("sendTeamOnboardingData", formData);
        }}
      />
    </div>
  );
}
