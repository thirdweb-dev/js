import type { Meta, StoryObj } from "@storybook/react";
import { stringify } from "viem";
import type { CompletedStatusResult } from "../../react/core/hooks/useStepExecutor.js";
import { webWindowAdapter } from "../../react/web/adapters/WindowAdapter.js";
import { SuccessScreen } from "../../react/web/ui/Bridge/payment-success/SuccessScreen.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";
import { simpleBuyQuote, simpleOnrampQuote } from "./fixtures.js";

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

const meta: Meta<typeof SuccessScreen> = {
  args: {
    completedStatuses: mockBuyCompletedStatuses,
    onDone: () => {},
    preparedQuote: simpleBuyQuote,
    showContinueWithTx: false,
    windowAdapter: webWindowAdapter,
    client: storyClient,
    hasPaymentId: false,
  },
  component: SuccessScreen,
  decorators: [
    (Story) => (
      <ModalThemeWrapper>
        <Story />
      </ModalThemeWrapper>
    ),
  ],
  title: "Bridge/screens/SuccessScreen",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};

export const OnrampPayment: Story = {
  args: {
    completedStatuses: mockOnrampCompletedStatuses,
    preparedQuote: simpleOnrampQuote,
  },
};

export const ComplexPayment: Story = {
  args: {
    completedStatuses: [
      ...mockOnrampCompletedStatuses,
      ...mockBuyCompletedStatuses,
    ],
    preparedQuote: simpleOnrampQuote,
  },
};

export const TransactionPayment: Story = {
  args: {
    completedStatuses: mockBuyCompletedStatuses,
    preparedQuote: simpleBuyQuote,
    showContinueWithTx: true,
  },
};

export const PaymentId: Story = {
  args: {
    completedStatuses: mockBuyCompletedStatuses,
    hasPaymentId: true,
    preparedQuote: simpleBuyQuote,
    showContinueWithTx: true,
  },
};
