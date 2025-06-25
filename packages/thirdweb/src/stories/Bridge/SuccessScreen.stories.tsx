import type { Meta, StoryObj } from "@storybook/react";
import { stringify } from "viem";
import type { Theme } from "../../react/core/design-system/index.js";
import type { CompletedStatusResult } from "../../react/core/hooks/useStepExecutor.js";
import { webWindowAdapter } from "../../react/web/adapters/WindowAdapter.js";
import {
  SuccessScreen,
  type SuccessScreenProps,
} from "../../react/web/ui/Bridge/payment-success/SuccessScreen.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";
import {
  FUND_WALLET_UI_OPTIONS,
  simpleBuyQuote,
  simpleOnrampQuote,
  TRANSACTION_UI_OPTIONS,
} from "./fixtures.js";

const mockBuyCompletedStatuses: CompletedStatusResult[] = JSON.parse(
  stringify([
    {
      destinationAmount: 100000000n,
      destinationChainId: 1,
      destinationToken: {
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        chainId: 1,
        decimals: 6,
        name: "USD Coin",
        priceUsd: 1,
        symbol: "USDC",
      },
      destinationTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      originAmount: 1000000000000000000n,
      originChainId: 1,
      originToken: {
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        chainId: 1,
        decimals: 18,
        name: "Ethereum",
        priceUsd: 2500,
        symbol: "ETH",
      },
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      paymentId: "payment-12345",
      receiver: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      sender: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      status: "COMPLETED",
      transactions: [
        {
          chainId: 1,
          transactionHash:
            "0x1234567890abcdef1234567890abcdef12345678901234567890abcdef123456",
        },
      ],
      type: "buy",
    },
  ]),
);

const mockOnrampCompletedStatuses: CompletedStatusResult[] = JSON.parse(
  stringify([
    {
      purchaseData: {
        orderId: "stripe-order-abc123",
      },
      status: "COMPLETED",
      transactions: [
        {
          chainId: 137,
          transactionHash:
            "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        },
      ],
      type: "onramp",
    },
  ]),
);

// Props interface for the wrapper component
interface SuccessScreenWithThemeProps extends SuccessScreenProps {
  theme: "light" | "dark" | Theme;
}

// Wrapper component to provide theme context
const SuccessScreenWithTheme = (props: SuccessScreenWithThemeProps) => {
  const { theme, ...componentProps } = props;
  return (
    <ModalThemeWrapper theme={theme}>
      <SuccessScreen {...componentProps} />
    </ModalThemeWrapper>
  );
};

const meta = {
  args: {
    completedStatuses: mockBuyCompletedStatuses,
    onDone: () => {},
    preparedQuote: simpleBuyQuote,
    theme: "dark",
    uiOptions: FUND_WALLET_UI_OPTIONS.ethDefault,
    windowAdapter: webWindowAdapter,
  },
  argTypes: {
    onDone: { action: "success screen closed" },
    theme: {
      control: "select",
      description: "Theme for the component",
      options: ["light", "dark"],
    },
  },
  component: SuccessScreenWithTheme,
  parameters: {
    docs: {
      description: {
        component:
          "Success screen that displays completion confirmation with transaction summary, payment details, and action buttons for next steps. Includes animated success icon and detailed transaction view.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Bridge/SuccessScreen",
} satisfies Meta<typeof SuccessScreenWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    client: storyClient,
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    client: storyClient,
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const OnrampPayment: Story = {
  args: {
    client: storyClient,
    completedStatuses: mockOnrampCompletedStatuses,
    preparedQuote: simpleOnrampQuote,
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Success screen for onramp payments showing payment ID that can be copied to clipboard.",
      },
    },
  },
};

export const OnrampPaymentLight: Story = {
  args: {
    client: storyClient,
    completedStatuses: mockOnrampCompletedStatuses,
    preparedQuote: simpleOnrampQuote,
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const ComplexPayment: Story = {
  args: {
    client: storyClient,
    completedStatuses: [
      ...mockOnrampCompletedStatuses,
      ...mockBuyCompletedStatuses,
    ],
    preparedQuote: simpleOnrampQuote,
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Success screen for onramp payments showing payment ID that can be copied to clipboard.",
      },
    },
  },
};

export const ComplexPaymentLight: Story = {
  args: {
    client: storyClient,
    completedStatuses: [
      ...mockOnrampCompletedStatuses,
      ...mockBuyCompletedStatuses,
    ],
    preparedQuote: simpleOnrampQuote,
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const TransactionPayment: Story = {
  args: {
    client: storyClient,
    completedStatuses: mockBuyCompletedStatuses,
    preparedQuote: simpleBuyQuote,
    theme: "light",
    uiOptions: TRANSACTION_UI_OPTIONS.contractInteraction,
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};
