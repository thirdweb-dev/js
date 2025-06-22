import type { Meta, StoryObj } from "@storybook/nextjs";
import { BadgeContainer } from "@/storybook/utils";
import { Stat } from "./Stat";

const meta = {
  component: Component,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Analytics/Stat",
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
        <Stat label="Active Users" trend={0.258707} value={5678} />
      </BadgeContainer>

      <BadgeContainer label="With Negative Trend">
        <Stat label="Daily Revenue" trend={-0.1507} value={9876} />
      </BadgeContainer>
    </div>
  );
}
