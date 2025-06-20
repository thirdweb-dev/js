import type { Meta, StoryObj } from "@storybook/nextjs";
import { JoinTeamPageUI } from "./JoinTeamPage";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Team/Join Team",
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
        invite={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
        teamName="XYZ Inc"
      />
    </div>
  );
}
