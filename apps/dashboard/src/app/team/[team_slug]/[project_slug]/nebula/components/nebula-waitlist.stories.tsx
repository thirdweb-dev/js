import type { Meta, StoryObj } from "@storybook/react";
import { mobileViewport } from "stories/utils";
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

export const Desktop: Story = {
  args: {
    inWaitlist: false,
  },
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Story() {
  return <NebulaWaitListPageUI teamId="foo" />;
}
