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
  title: "Connect/ConnectButton/hide buttons",
} satisfies Meta<typeof ConnectButton>;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const HideSend: Story = {
  args: {
    detailsModal: {
      hideSendFunds: true,
    },
  },
};

export const HideReceive: Story = {
  args: {
    detailsModal: {
      hideReceiveFunds: true,
    },
  },
};

export const HideBuy: Story = {
  args: {
    detailsModal: {
      hideBuyFunds: true,
    },
  },
};

export const HideSendReceive: Story = {
  args: {
    detailsModal: {
      hideReceiveFunds: true,
      hideSendFunds: true,
    },
  },
};

export const HideSendBuy: Story = {
  args: {
    detailsModal: {
      hideBuyFunds: true,
      hideSendFunds: true,
    },
  },
};

export const HideReceiveBuy: Story = {
  args: {
    detailsModal: {
      hideBuyFunds: true,
      hideReceiveFunds: true,
    },
  },
};

export const HideSendReceiveBuy: Story = {
  args: {
    detailsModal: {
      hideBuyFunds: true,
      hideReceiveFunds: true,
      hideSendFunds: true,
    },
  },
};

export default meta;
