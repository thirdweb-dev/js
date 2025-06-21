import type { Meta, StoryObj } from "@storybook/nextjs";
import { EngineFooterCard } from "./_components";

const meta = {
  args: {
    projectSlug: "demo-project",
    teamSlug: "demo-team",
  },
  component: EngineFooterCard,
  decorators: [
    (Story) => (
      <div className="container max-w-6xl py-10">
        <Story />
      </div>
    ),
  ],
  title: "Engine/EngineFooterCard",
} satisfies Meta<typeof EngineFooterCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Growth: Story = {};

export const Scale: Story = {};

export const Pro: Story = {};
