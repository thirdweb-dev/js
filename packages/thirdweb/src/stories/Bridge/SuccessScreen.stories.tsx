import type { Meta, StoryObj } from "@storybook/react";
import { stringify } from "viem";
import type { Theme } from "../../react/core/design-system/index.js";
import type { CompletedStatusResult } from "../../react/core/hooks/useStepExecutor.js";
import { webWindowAdapter } from "../../react/web/adapters/WindowAdapter.js";
import {
  SuccessScreen,
  type SuccessScreenProps,
} from "../../react/web/ui/Bridge/payment-success/SuccessScreen.js";
import { ModalThemeWrapper } from "../utils.js";
import {
  FUND_WALLET_UI_OPTIONS,
  simpleBuyQuote,
  simpleOnrampQuote,
} from "./fixtures.js";

const mockBuyCompletedStatuses: CompletedStatusResult[] = JSON.parse(
  stringify([
    {
      type: "buy",
      status: "COMPLETED",
      paymentId: "payment-12345",
      originAmount: 1000000000000000000n,
      destinationAmount: 100000000n,
      originChainId: 1,
      destinationChainId: 1,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      destinationTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      originToken: {
        chainId: 1,
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        symbol: "ETH",
        name: "Ethereum",
        decimals: 18,
        priceUsd: 2500,
      },
      destinationToken: {
        chainId: 1,
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        priceUsd: 1,
      },
      sender: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      receiver: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      transactions: [
        {
          chainId: 1,
          transactionHash:
            "0x1234567890abcdef1234567890abcdef12345678901234567890abcdef123456",
        },
      ],
    },
  ]),
);

const mockOnrampCompletedStatuses: CompletedStatusResult[] = JSON.parse(
  stringify([
    {
      type: "onramp",
      status: "COMPLETED",
      transactions: [
        {
          chainId: 137,
          transactionHash:
            "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        },
      ],
      purchaseData: {
        orderId: "stripe-order-abc123",
      },
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
  title: "Bridge/SuccessScreen",
  component: SuccessScreenWithTheme,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Success screen that displays completion confirmation with transaction summary, payment details, and action buttons for next steps. Includes animated success icon and detailed transaction view.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    preparedQuote: simpleBuyQuote,
    completedStatuses: mockBuyCompletedStatuses,
    onDone: () => console.log("Success screen closed"),
    theme: "dark",
    windowAdapter: webWindowAdapter,
    uiOptions: FUND_WALLET_UI_OPTIONS.ethDefault,
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Theme for the component",
    },
    onDone: { action: "success screen closed" },
  },
} satisfies Meta<typeof SuccessScreenWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const OnrampPayment: Story = {
  args: {
    theme: "dark",
    preparedQuote: simpleOnrampQuote,
    completedStatuses: mockOnrampCompletedStatuses,
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
    theme: "light",
    preparedQuote: simpleOnrampQuote,
    completedStatuses: mockOnrampCompletedStatuses,
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const ComplexPayment: Story = {
  args: {
    theme: "dark",
    preparedQuote: simpleOnrampQuote,
    completedStatuses: [
      ...mockOnrampCompletedStatuses,
      ...mockBuyCompletedStatuses,
    ],
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
    theme: "light",
    preparedQuote: simpleOnrampQuote,
    completedStatuses: [
      ...mockOnrampCompletedStatuses,
      ...mockBuyCompletedStatuses,
    ],
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};
