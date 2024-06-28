import type { Meta, StoryObj } from "@storybook/react";
import { FiatFlowStory } from "./FiatFlowStory.js";

const meta = {
  title: "Pay/Flows/Confirm Fiat Flow (New)",
  component: FiatFlowStory,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof FiatFlowStory>;

type Story = StoryObj<typeof meta>;

export const Dark: Story = {
  args: {
    theme: "dark",
  },
};

export const Light: Story = {
  args: {
    theme: "light",
  },
};

export default meta;
