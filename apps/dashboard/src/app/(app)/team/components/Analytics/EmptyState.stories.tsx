import type { Meta, StoryObj } from "@storybook/nextjs";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Analytics/EmptyState",
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

function Component() {
  return (
    <div className="container max-w-6xl py-10">
      <EmptyState />
    </div>
  );
}
