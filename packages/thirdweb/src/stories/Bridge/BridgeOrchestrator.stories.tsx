import type { Meta, StoryObj } from "@storybook/react";
import type { Theme } from "../../react/core/design-system/index.js";
import {
  BridgeOrchestrator,
  type BridgeOrchestratorProps,
} from "../../react/web/ui/Bridge/BridgeOrchestrator.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";
import {
  DIRECT_PAYMENT_UI_OPTIONS,
  FUND_WALLET_UI_OPTIONS,
  TRANSACTION_UI_OPTIONS,
} from "./fixtures.js";

/**
 * BridgeOrchestrator is the main orchestrator component for the Bridge payment flow.
 * It manages the complete state machine navigation between different screens and
 * handles the coordination of payment methods, routes, and execution.
 */

// Props interface for the wrapper component
interface BridgeOrchestratorWithThemeProps extends BridgeOrchestratorProps {
  theme: "light" | "dark" | Theme;
}

// Wrapper component to provide theme context
const BridgeOrchestratorWithTheme = (
  props: BridgeOrchestratorWithThemeProps,
) => {
  const { theme, ...componentProps } = props;
  return (
    <ModalThemeWrapper theme={theme}>
      <BridgeOrchestrator {...componentProps} />
    </ModalThemeWrapper>
  );
};

const meta = {
  args: {
    client: storyClient,
    onCancel: () => {},
    onComplete: () => {},
    onError: (error) => console.error("Bridge error:", error),
    theme: "dark",
    uiOptions: FUND_WALLET_UI_OPTIONS.usdcDefault,
  },
  argTypes: {
    onCancel: { action: "flow cancelled" },
    onComplete: { action: "flow completed" },
    onError: { action: "error occurred" },
    presetOptions: {
      control: "object",
      description: "Quick buy options",
    },
    theme: {
      control: "select",
      description: "Theme for the component",
      options: ["light", "dark"],
    },
  },
  component: BridgeOrchestratorWithTheme,
  parameters: {
    docs: {
      description: {
        component:
          "**BridgeOrchestrator** is the main orchestrator component that manages the complete Bridge payment flow using XState FSM.\n\n" +
          "## Features\n" +
          "- **State Machine Navigation**: Uses XState v5 for predictable state transitions\n" +
          "- **Payment Method Selection**: Supports wallet and fiat payment methods\n" +
          "- **Route Preview**: Shows detailed transaction steps and fees\n" +
          "- **Step Execution**: Real-time progress tracking\n" +
          "- **Error Handling**: Comprehensive error states with retry functionality\n" +
          "- **Theme Support**: Works with both light and dark themes\n\n" +
          "## State Flow\n" +
          "1. **Resolve Requirements** → 2. **Method Selection** → 3. **Quote** → 4. **Preview** → 5. **Prepare** → 6. **Execute** → 7. **Success**\n\n" +
          "Each state can transition to the **Error** state, which provides retry functionality.",
      },
    },
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "Bridge/BridgeOrchestrator",
} satisfies Meta<typeof BridgeOrchestratorWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default BridgeOrchestrator in light theme.
 */
export const Light: Story = {
  args: {
    connectLocale: undefined,
    connectOptions: undefined,
    onCancel: undefined,
    onComplete: undefined,
    onError: undefined,
    paymentLinkId: undefined,
    presetOptions: undefined,
    purchaseData: undefined,
    receiverAddress: undefined,
    theme: "light",
    uiOptions: FUND_WALLET_UI_OPTIONS.usdcDefault,
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

/**
 * BridgeOrchestrator in dark theme.
 */
export const Dark: Story = {
  args: {
    connectLocale: undefined,
    connectOptions: undefined,
    onCancel: undefined,
    onComplete: undefined,
    onError: undefined,
    paymentLinkId: undefined,
    presetOptions: undefined,
    purchaseData: undefined,
    receiverAddress: undefined,
    theme: "dark",
    uiOptions: FUND_WALLET_UI_OPTIONS.usdcDefault,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * Direct payment mode for purchasing a specific product/service.
 */
export const DirectPayment: Story = {
  args: {
    connectLocale: undefined,
    connectOptions: undefined,
    onCancel: undefined,
    onComplete: undefined,
    onError: undefined,
    paymentLinkId: undefined,
    presetOptions: undefined,
    purchaseData: undefined,
    receiverAddress: undefined,
    theme: "dark",
    uiOptions: DIRECT_PAYMENT_UI_OPTIONS.digitalArt,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Direct payment mode shows a product purchase interface with the item image, price, seller address, and network information. The user can connect their wallet and proceed with the payment.",
      },
    },
  },
};

/**
 * Direct payment mode in light theme.
 */
export const DirectPaymentLight: Story = {
  args: {
    connectLocale: undefined,
    connectOptions: undefined,
    onCancel: undefined,
    onComplete: undefined,
    onError: undefined,
    paymentLinkId: undefined,
    presetOptions: undefined,
    purchaseData: undefined,
    receiverAddress: undefined,
    theme: "light",
    uiOptions: DIRECT_PAYMENT_UI_OPTIONS.concertTicket,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Light theme version of direct payment mode, showing a different product example with USDC payment.",
      },
    },
  },
};

/**
 * Transaction mode showing a complex contract interaction.
 */
export const Transaction: Story = {
  args: {
    connectLocale: undefined,
    connectOptions: undefined,
    onCancel: undefined,
    onComplete: undefined,
    onError: undefined,
    paymentLinkId: undefined,
    presetOptions: undefined,
    purchaseData: undefined,
    receiverAddress: undefined,
    theme: "dark",
    uiOptions: TRANSACTION_UI_OPTIONS.contractInteraction,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Transaction mode showing a complex contract interaction (claimTo function) with function name extraction from contract ABI and detailed cost breakdown.",
      },
    },
  },
};

/**
 * Transaction mode in light theme showing an ERC20 token transfer.
 */
export const TransactionLight: Story = {
  args: {
    connectLocale: undefined,
    connectOptions: undefined,
    onCancel: undefined,
    onComplete: undefined,
    onError: undefined,
    paymentLinkId: undefined,
    presetOptions: undefined,
    purchaseData: undefined,
    receiverAddress: undefined,
    theme: "light",
    uiOptions: TRANSACTION_UI_OPTIONS.erc20Transfer,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Light theme version of transaction mode showing an ERC20 token transfer with proper token amount formatting and USD conversion.",
      },
    },
  },
};

export const CustompresetOptions: Story = {
  args: {
    connectLocale: undefined,
    connectOptions: undefined,
    onCancel: undefined,
    onComplete: undefined,
    onError: undefined,
    paymentLinkId: undefined,
    presetOptions: [1, 2, 3],
    purchaseData: undefined,
    receiverAddress: undefined,
    theme: "dark",
    uiOptions: FUND_WALLET_UI_OPTIONS.ethDefault,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Fund wallet mode with custom quick options showing ETH with [1, 2, 3] preset amounts.",
      },
    },
  },
};
