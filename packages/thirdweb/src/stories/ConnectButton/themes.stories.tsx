import type { Meta, StoryObj } from "@storybook/react-vite";
import { darkTheme } from "../../react/core/design-system/index.js";
import { ConnectButton } from "../../react/web/ui/ConnectWallet/ConnectButton.js";
import { storyClient } from "../utils.js";

const meta = {
  args: {
    client: storyClient,
  },
  component: ConnectButton,
  parameters: {
    layout: "centered",
  },
  title: "Connect/ConnectButton/themes",
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

export const CustomBlack: Story = {
  args: {
    theme: darkTheme({
      colors: {
        modalBg: "black",
      },
    }),
  },
};

export default meta;
