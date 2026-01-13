import type { Meta, StoryObj } from "@storybook/react-vite";
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
  title: "Connect/ConnectButton/others",
} satisfies Meta<typeof ConnectButton>;

type Story = StoryObj<typeof meta>;

export const WideModal: Story = {
  args: {
    connectModal: {
      size: "wide",
    },
  },
};

export const CompactModal: Story = {
  args: {
    connectModal: {
      size: "compact",
    },
  },
};

export default meta;
