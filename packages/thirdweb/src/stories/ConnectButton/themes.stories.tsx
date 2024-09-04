import type { Meta, StoryObj } from "@storybook/react";
import { ConnectButton } from "../../react/web/ui/ConnectWallet/ConnectButton.js";
import { storyClient } from "../utils.js";

const meta = {
  title: "Connect/ConnectButton/themes",
  component: ConnectButton,
  parameters: {
    layout: "centered",
  },
  args: {
    client: storyClient,
  },
} satisfies Meta<typeof ConnectButton>;

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
