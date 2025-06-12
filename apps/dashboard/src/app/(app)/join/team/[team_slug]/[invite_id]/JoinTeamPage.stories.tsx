import type { Meta, StoryObj } from "@storybook/nextjs";
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

export const Variants: Story = {
  args: {},
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
    </div>
  );
}
