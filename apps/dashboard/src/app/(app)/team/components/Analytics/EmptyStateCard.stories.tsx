import type { Meta, StoryObj } from "@storybook/nextjs";
import { BadgeContainer } from "@/storybook/utils";
import { EmptyStateCard } from "./EmptyStateCard";

const meta = {
  component: Component,
  title: "Analytics/EmptyStateCard",
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

function Component() {
  return (
    <div className="container max-w-6xl space-y-10 py-10">
      <BadgeContainer label="With Metric">
        <EmptyStateCard metric="xyz" />
      </BadgeContainer>

      <BadgeContainer label="With Link">
        <EmptyStateCard link="https://docs.example.com/xyz" />
      </BadgeContainer>

      <BadgeContainer label="With Link and Metric">
        <EmptyStateCard link="https://docs.example.com/xyz" metric="xyz" />
      </BadgeContainer>
    </div>
  );
}
