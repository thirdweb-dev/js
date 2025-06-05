import type { Meta, StoryObj } from "@storybook/react";
import {} from "../../react/core/design-system/CustomThemeProvider.js";
import type { Theme } from "../../react/core/design-system/index.js";
import {
  BridgeOrchestrator,
  type BridgeOrchestratorProps,
} from "../../react/web/ui/Bridge/BridgeOrchestrator.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";
import { ETH, USDC } from "./fixtures.js";

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
  title: "Bridge/BridgeOrchestrator",
  component: BridgeOrchestratorWithTheme,
  parameters: {
    layout: "fullscreen",
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
  },
  tags: ["autodocs"],
  args: {
    client: storyClient,
    onComplete: () => console.log("Bridge flow completed"),
    onError: (error) => console.error("Bridge error:", error),
    onCancel: () => console.log("Bridge flow cancelled"),
    theme: "dark",
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Theme for the component",
    },
    onComplete: { action: "flow completed" },
    onError: { action: "error occurred" },
    onCancel: { action: "flow cancelled" },
  },
} satisfies Meta<typeof BridgeOrchestratorWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default BridgeOrchestrator in light theme.
 */
export const Light: Story = {
  args: {
    theme: "light",
    uiOptions: {
      mode: "fund_wallet",
      destinationToken: USDC,
      initialAmount: "100",
    },
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
    theme: "dark",
    uiOptions: {
      mode: "fund_wallet",
      destinationToken: USDC,
      initialAmount: "100",
    },
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
    theme: "dark",
    uiOptions: {
      mode: "direct_payment",
      paymentInfo: {
        sellerAddress: "0x1234567890123456789012345678901234567890",
        token: ETH,
        amount: "0.0001",
        feePayer: "sender",
        metadata: {
          name: "Digital Art NFT",
          description: "This is a premium digital art by a famous artist",
          image:
            "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=500&h=300&fit=crop",
        },
      },
    },
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
    theme: "light",
    uiOptions: {
      mode: "direct_payment",
      paymentInfo: {
        sellerAddress: "0x1234567890123456789012345678901234567890",
        token: USDC,
        amount: "0.1",
        feePayer: "receiver",
        metadata: {
          name: "Concert Ticket",
          description: "Concert ticket for the upcoming show",
          image:
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&h=300&fit=crop",
        },
      },
    },
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
