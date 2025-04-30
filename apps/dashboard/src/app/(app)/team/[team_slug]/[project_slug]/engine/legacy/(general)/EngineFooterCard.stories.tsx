import type { Meta, StoryObj } from "@storybook/react";
import { EngineFooterCard } from "./_components";

const meta = {
  title: "Engine/EngineFooterCard",
  component: EngineFooterCard,
  args: {
    team_slug: "demo-team",
  },
  decorators: [
    (Story) => (
      <div className="container max-w-6xl py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EngineFooterCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Growth: Story = {
  args: {
    teamPlan: "growth",
  },
};

export const Accelerate: Story = {
  args: {
    teamPlan: "accelerate",
  },
};

export const Scale: Story = {
  args: {
    teamPlan: "scale",
  },
};

export const Pro: Story = {
  args: {
    teamPlan: "pro",
  },
};
