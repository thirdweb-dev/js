import type { Meta, StoryObj } from "@storybook/react";
import { PayEmbed } from "../react/web/ui/PayEmbed.js";
import { storyClient } from "./utils.js";

const meta = {
  title: "Connect/PayEmbed",
  component: PayEmbed,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    client: storyClient,
  },
} satisfies Meta<typeof PayEmbed>;

type Story = StoryObj<typeof meta>;

export const Dark: Story = {
  args: {
    theme: "dark",
  },
};

export const FiatTestMode: Story = {
  args: {
    theme: "dark",
    payOptions: {
      buyWithFiat: {
        testMode: true,
      },
    },
  },
};

export const Light: Story = {
  args: {
    theme: "light",
  },
};

export default meta;
