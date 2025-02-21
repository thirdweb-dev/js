import { Toaster } from "@/components/ui/sonner";
import type { Meta, StoryObj } from "@storybook/react";
import { mobileViewport } from "../../../../../stories/utils";
import { JoinTeamPageUI } from "./JoinTeamPage";

const meta = {
  title: "Team/Join Team",
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
    <div>
      <JoinTeamPageUI
        teamName="XYZ Inc"
        invite={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      />
      <Toaster richColors />
    </div>
  );
}
