import type { Meta, StoryObj } from "@storybook/react";
import { NebulaWaitListPageUI } from "./nebula-waitlist-page-ui.client";

const meta = {
  title: "nebula/waitlist",
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
  args: {
    inWaitlist: false,
  },
};

function Story() {
  return <NebulaWaitListPageUI teamId="foo" />;
}
