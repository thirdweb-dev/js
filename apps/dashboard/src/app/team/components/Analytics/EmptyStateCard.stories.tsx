import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer, mobileViewport } from "stories/utils";
import { EmptyStateCard } from "./EmptyStateCard";

const meta = {
  title: "Analytics/EmptyStateCard",
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
    <div className="container max-w-[1000px] space-y-8 py-8">
      <BadgeContainer label="Basic">
        <EmptyStateCard metric="transactions" />
      </BadgeContainer>

      <BadgeContainer label="With Link">
        <EmptyStateCard
          metric="revenue"
          link="https://docs.example.com/analytics"
        />
      </BadgeContainer>
    </div>
  );
}
