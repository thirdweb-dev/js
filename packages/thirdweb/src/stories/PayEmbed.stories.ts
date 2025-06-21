import type { Meta, StoryObj } from "@storybook/react-vite";
import { PayEmbed } from "../react/web/ui/PayEmbed.js";
import { storyClient } from "./utils.js";

const meta = {
  args: {
    client: storyClient,
  },
  component: PayEmbed,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Connect/PayEmbed",
} satisfies Meta<typeof PayEmbed>;

type Story = StoryObj<typeof meta>;

export const Dark: Story = {
  args: {
    theme: "dark",
  },
};

export const FiatTestMode: Story = {
  args: {
    payOptions: {
      buyWithFiat: {
        testMode: true,
      },
    },
    theme: "dark",
  },
};

export const Light: Story = {
  args: {
    theme: "light",
  },
};

export default meta;
