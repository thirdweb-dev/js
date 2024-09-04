import type { Meta, StoryObj } from "@storybook/react";
import { ConnectButton } from "../../react/web/ui/ConnectWallet/ConnectButton.js";
import { storyClient } from "../utils.js";

const meta = {
  title: "Connect/ConnectButton/hide buttons",
  component: ConnectButton,
  parameters: {
    layout: "centered",
  },
  args: {
    client: storyClient,
  },
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
      hideSendFunds: true,
      hideReceiveFunds: true,
    },
  },
};

export const HideSendBuy: Story = {
  args: {
    detailsModal: {
      hideSendFunds: true,
      hideBuyFunds: true,
    },
  },
};

export const HideReceiveBuy: Story = {
  args: {
    detailsModal: {
      hideReceiveFunds: true,
      hideBuyFunds: true,
    },
  },
};

export const HideSendReceiveBuy: Story = {
  args: {
    detailsModal: {
      hideSendFunds: true,
      hideReceiveFunds: true,
      hideBuyFunds: true,
    },
  },
};

export default meta;
