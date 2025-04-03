import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer } from "stories/utils";
import { Stat } from "./Stat";

const meta = {
  title: "Analytics/Stat",
  component: Component,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

function Component() {
  return (
    <div className="container max-w-[400px] space-y-8 py-8">
      <BadgeContainer label="Basic">
        <Stat label="Total Users" value={1234} />
      </BadgeContainer>

      <BadgeContainer label="With Positive Trend">
        <Stat label="Active Users" value={5678} trend={0.258707} />
      </BadgeContainer>

      <BadgeContainer label="With Negative Trend">
        <Stat label="Daily Revenue" value={9876} trend={-0.1507} />
      </BadgeContainer>
    </div>
  );
}
