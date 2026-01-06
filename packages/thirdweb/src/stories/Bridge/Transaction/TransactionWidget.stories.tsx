import type { Meta, StoryObj } from "@storybook/react";
import {
  TransactionWidget,
  type TransactionWidgetProps,
} from "../../../react/web/ui/Bridge/TransactionWidget.js";
import { createWallet } from "../../../wallets/create-wallet.js";
import { storyClient } from "../../utils.js";
import { TRANSACTION_UI_OPTIONS } from "../fixtures.js";

const meta: Meta<typeof StoryVariant> = {
  args: {
    client: storyClient,
    onSuccess: () => {},
    onError: () => {},
    onCancel: () => {},
    currency: "USD",
  },
  component: StoryVariant,
  title: "Bridge/Transaction/TransactionWidget",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BaseEthTransfer: Story = {
  args: {
    ...TRANSACTION_UI_OPTIONS.ethTransfer,
  },
};

export const BaseEthTransferWithDescription: Story = {
  args: {
    ...TRANSACTION_UI_OPTIONS.ethTransfer,
    description: "This is a description of the transaction",
  },
};

export const BaseEthTransferWithImage: Story = {
  args: {
    ...TRANSACTION_UI_OPTIONS.ethTransfer,
    description: "This is a description of the transaction",
    image: "https://picsum.photos/400/600",
  },
};

export const EthereumTransferCustomWallets: Story = {
  args: {
    ...TRANSACTION_UI_OPTIONS.ethTransfer,
    connectOptions: {
      wallets: [createWallet("io.metamask"), createWallet("me.rainbow")],
    },
  },
};

export const ERC20TokenTransfer: Story = {
  args: {
    ...TRANSACTION_UI_OPTIONS.erc20Transfer,
  },
};

export const ContractInteraction: Story = {
  args: {
    ...TRANSACTION_UI_OPTIONS.contractInteraction,
  },
};

export const CustomButtonLabel: Story = {
  args: {
    ...TRANSACTION_UI_OPTIONS.customButton,
  },
};

function StoryVariant(props: TransactionWidgetProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        alignItems: "center",
      }}
    >
      <TransactionWidget {...props} theme="dark" />
      <TransactionWidget {...props} theme="light" />
    </div>
  );
}
