import type { Meta, StoryObj } from "@storybook/react";
import {
  TransactionPayment,
  type TransactionPaymentProps,
} from "../../react/web/ui/Bridge/TransactionPayment.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";
import {
  contractInteractionTransaction,
  erc20Transaction,
  ethTransferTransaction,
} from "./fixtures.js";

// Props interface for the wrapper component
interface TransactionPaymentWithThemeProps extends TransactionPaymentProps {
  theme: "light" | "dark";
}

// Wrapper component to provide theme context
const TransactionPaymentWithTheme = (
  props: TransactionPaymentWithThemeProps,
) => {
  const { theme, ...componentProps } = props;

  return (
    <ModalThemeWrapper theme={theme}>
      <div style={{ width: "400px" }}>
        <TransactionPayment {...componentProps} />
      </div>
    </ModalThemeWrapper>
  );
};

const meta = {
  title: "Bridge/TransactionPayment",
  component: TransactionPaymentWithTheme,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Transaction payment component that displays detailed transaction information including contract details, function names, transaction costs, and network fees. Supports both native token and ERC20 token transactions.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    transaction: ethTransferTransaction,
    client: storyClient,
    onContinue: () => console.log("Execute transaction"),
    theme: "dark",
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Theme for the component",
    },
    onContinue: { action: "continue clicked" },
  },
} satisfies Meta<typeof TransactionPaymentWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EthereumTransfer: Story = {
  args: {
    transaction: ethTransferTransaction,
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Simple ETH transfer transaction showing native token value and network fees with USD conversion.",
      },
    },
  },
};

export const EthereumTransferLight: Story = {
  args: {
    transaction: ethTransferTransaction,
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Simple ETH transfer transaction in light theme with skeleton loading support.",
      },
    },
  },
};

export const ERC20TokenTransfer: Story = {
  args: {
    transaction: erc20Transaction,
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "ERC20 token transaction showing token amount, USD value, and proper formatting using real token data.",
      },
    },
  },
};

export const ERC20TokenTransferLight: Story = {
  args: {
    transaction: erc20Transaction,
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "ERC20 token transaction in light theme with enhanced formatting.",
      },
    },
  },
};

export const ContractInteraction: Story = {
  args: {
    transaction: contractInteractionTransaction,
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Complex contract interaction showing function name extraction from ABI, cost calculation, and network details with proper currency formatting.",
      },
    },
  },
};

export const ContractInteractionLight: Story = {
  args: {
    transaction: contractInteractionTransaction,
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Contract interaction transaction in light theme with enhanced UX and skeleton loading.",
      },
    },
  },
};
