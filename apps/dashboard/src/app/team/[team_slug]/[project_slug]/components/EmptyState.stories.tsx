import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer, mobileViewport } from "stories/utils";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "project/Overview/EmptyState",
  component: Component,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export const Mobile: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    viewport: mobileViewport("iphone14"),
  },
};

function Component() {
  return (
    <div className="container max-w-[1150px] py-8">
      <BadgeContainer label="Base">
        <EmptyState />
      </BadgeContainer>
    </div>
  );
}
