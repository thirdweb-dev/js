import type { Meta, StoryObj } from "@storybook/react";
import { EngineFooterCard } from "./_components";

const meta = {
  title: "Engine/EngineFooterCard",
  component: EngineFooterCard,
  args: {
    teamSlug: "demo-team",
    projectSlug: "demo-project",
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

export const Growth: Story = {};

export const Scale: Story = {};

export const Pro: Story = {};
