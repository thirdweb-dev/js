import type { Meta, StoryObj } from "@storybook/react";
import {
  TransactionPayment,
  type TransactionPaymentProps,
} from "../../react/web/ui/Bridge/TransactionPayment.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";
import { TRANSACTION_UI_OPTIONS } from "./fixtures.js";

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
          "Transaction payment component that displays detailed transaction information including contract details, function names, transaction costs, and network fees.\n\n" +
          "## Features\n" +
          "- **Contract Information**: Shows contract name and clickable address\n" +
          "- **Function Detection**: Extracts function names from transaction data using ABI\n" +
          "- **Cost Calculation**: Displays transaction value and USD equivalent\n" +
          "- **Network Fees**: Shows estimated gas costs with token amounts\n" +
          "- **Chain Details**: Network name and logo with proper formatting\n" +
          "- **Skeleton Loading**: Comprehensive loading states matching final layout\n\n" +
          "This component now accepts uiOptions directly to configure the transaction and metadata. Supports both native token and ERC20 token transactions with proper function name extraction.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    uiOptions: TRANSACTION_UI_OPTIONS.ethTransfer,
    client: storyClient,
    onContinue: (_amount, _token, _receiverAddress) => {},
    theme: "dark",
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Theme for the component",
    },
    onContinue: {
      action: "continue clicked",
      description: "Called when user continues with the transaction",
    },
    uiOptions: {
      description:
        "UI configuration for transaction mode including prepared transaction",
    },
  },
} satisfies Meta<typeof TransactionPaymentWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EthereumTransfer: Story = {
  args: {
    uiOptions: TRANSACTION_UI_OPTIONS.ethTransfer,
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Simple ETH transfer transaction showing native token value and network fees with USD conversion. Demonstrates function name extraction from contract ABI.",
      },
    },
  },
};

export const EthereumTransferLight: Story = {
  args: {
    uiOptions: TRANSACTION_UI_OPTIONS.ethTransfer,
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
    uiOptions: TRANSACTION_UI_OPTIONS.erc20Transfer,
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "ERC20 token transaction showing token amount, USD value, and proper formatting using real token data. Displays transfer function details.",
      },
    },
  },
};

export const ERC20TokenTransferLight: Story = {
  args: {
    uiOptions: TRANSACTION_UI_OPTIONS.erc20Transfer,
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
    uiOptions: TRANSACTION_UI_OPTIONS.contractInteraction,
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Complex contract interaction showing function name extraction from ABI (claimTo), cost calculation, and network details with proper currency formatting.",
      },
    },
  },
};

export const ContractInteractionLight: Story = {
  args: {
    uiOptions: TRANSACTION_UI_OPTIONS.contractInteraction,
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
