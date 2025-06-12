import type { Meta, StoryObj } from "@storybook/react";
import type { Theme } from "../../react/core/design-system/index.js";
import type { PaymentMethod } from "../../react/core/machines/paymentMachine.js";
import {
  PaymentDetails,
  type PaymentDetailsProps,
} from "../../react/web/ui/Bridge/payment-details/PaymentDetails.js";
import { stringify } from "../../utils/json.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";
import {
  DIRECT_PAYMENT_UI_OPTIONS,
  STORY_MOCK_WALLET,
  TRANSACTION_UI_OPTIONS,
  USDC,
  buyWithApprovalQuote,
  complexBuyQuote,
  longTextBuyQuote,
  onrampWithSwapsQuote,
  simpleBuyQuote,
  simpleOnrampQuote,
} from "./fixtures.js";

const fiatPaymentMethod: PaymentMethod = {
  type: "fiat",
  currency: "USD",
  onramp: "coinbase",
  payerWallet: STORY_MOCK_WALLET,
};

const cryptoPaymentMethod: PaymentMethod = JSON.parse(
  stringify({
    type: "wallet",
    payerWallet: STORY_MOCK_WALLET,
    balance: 100000000n,
    originToken: {
      chainId: 1,
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      priceUsd: 1.0,
      iconUri:
        "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
    },
  }),
);

const ethCryptoPaymentMethod: PaymentMethod = JSON.parse(
  stringify({
    type: "wallet",
    payerWallet: STORY_MOCK_WALLET,
    balance: 1000000000000000000n,
    originToken: {
      chainId: 1,
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      priceUsd: 2500.0,
      iconUri:
        "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
    },
  }),
);

// Props interface for the wrapper component
interface PaymentDetailsWithThemeProps extends PaymentDetailsProps {
  theme: "light" | "dark" | Theme;
}

// Wrapper component to provide theme context
const PaymentDetailsWithTheme = (props: PaymentDetailsWithThemeProps) => {
  const { theme, ...componentProps } = props;
  return (
    <ModalThemeWrapper theme={theme}>
      <PaymentDetails {...componentProps} />
    </ModalThemeWrapper>
  );
};

const meta = {
  title: "Bridge/PaymentDetails",
  component: PaymentDetailsWithTheme,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Route preview screen that displays prepared quote details, fees, estimated time, and transaction steps for user confirmation.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    preparedQuote: simpleOnrampQuote,
    onConfirm: () => {},
    onBack: () => {},
    onError: (error) => console.error("Error:", error),
    theme: "dark",
    uiOptions: {
      mode: "fund_wallet",
      destinationToken: USDC,
    },
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Theme for the component",
    },
    onConfirm: { action: "route confirmed" },
    onBack: { action: "back clicked" },
    onError: { action: "error occurred" },
  },
} satisfies Meta<typeof PaymentDetailsWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnrampSimple: Story = {
  args: {
    theme: "dark",
    preparedQuote: simpleOnrampQuote,
    paymentMethod: fiatPaymentMethod,
    client: storyClient,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Simple onramp quote with no extra steps - direct fiat to crypto.",
      },
    },
  },
};

export const OnrampSimpleLight: Story = {
  args: {
    theme: "light",
    preparedQuote: simpleOnrampQuote,
    paymentMethod: fiatPaymentMethod,
    client: storyClient,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story: "Simple onramp quote with no extra steps (light theme).",
      },
    },
  },
};

export const OnrampSimpleDirectPayment: Story = {
  args: {
    theme: "dark",
    preparedQuote: simpleOnrampQuote,
    paymentMethod: fiatPaymentMethod,
    client: storyClient,
    uiOptions: DIRECT_PAYMENT_UI_OPTIONS.credits,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Simple onramp quote with no extra steps - direct fiat to crypto.",
      },
    },
  },
};

export const OnrampSimpleLightDirectPayment: Story = {
  args: {
    theme: "light",
    preparedQuote: simpleOnrampQuote,
    paymentMethod: fiatPaymentMethod,
    client: storyClient,
    uiOptions: DIRECT_PAYMENT_UI_OPTIONS.concertTicket,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story: "Simple onramp quote with no extra steps (light theme).",
      },
    },
  },
};

export const OnrampWithSwaps: Story = {
  args: {
    theme: "dark",
    preparedQuote: onrampWithSwapsQuote,
    paymentMethod: fiatPaymentMethod,
    client: storyClient,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Onramp quote with 2 additional swap steps after the fiat purchase.",
      },
    },
  },
};

export const OnrampWithSwapsLight: Story = {
  args: {
    theme: "light",
    preparedQuote: onrampWithSwapsQuote,
    paymentMethod: fiatPaymentMethod,
    client: storyClient,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story: "Onramp quote with 2 additional swap steps (light theme).",
      },
    },
  },
};

export const BuySimple: Story = {
  args: {
    theme: "dark",
    preparedQuote: simpleBuyQuote,
    paymentMethod: ethCryptoPaymentMethod,
    client: storyClient,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Simple buy quote with a single transaction (no approval needed).",
      },
    },
  },
};

export const BuySimpleLight: Story = {
  args: {
    theme: "light",
    preparedQuote: simpleBuyQuote,
    paymentMethod: ethCryptoPaymentMethod,
    client: storyClient,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story: "Simple buy quote with a single transaction (light theme).",
      },
    },
  },
};

export const BuySimpleDirectPayment: Story = {
  args: {
    theme: "dark",
    preparedQuote: simpleBuyQuote,
    paymentMethod: ethCryptoPaymentMethod,
    client: storyClient,
    uiOptions: DIRECT_PAYMENT_UI_OPTIONS.digitalArt,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Simple buy quote with a single transaction (no approval needed).",
      },
    },
  },
};

export const BuySimpleLightDirectPayment: Story = {
  args: {
    theme: "light",
    preparedQuote: simpleBuyQuote,
    paymentMethod: ethCryptoPaymentMethod,
    client: storyClient,
    uiOptions: DIRECT_PAYMENT_UI_OPTIONS.subscription,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story: "Simple buy quote with a single transaction (light theme).",
      },
    },
  },
};

export const BuyWithLongText: Story = {
  args: {
    theme: "dark",
    preparedQuote: longTextBuyQuote,
    paymentMethod: ethCryptoPaymentMethod,
    client: storyClient,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story: "Simple buy quote with a single transaction (light theme).",
      },
    },
  },
};

export const BuyWithApproval: Story = {
  args: {
    theme: "dark",
    preparedQuote: buyWithApprovalQuote,
    paymentMethod: cryptoPaymentMethod,
    client: storyClient,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Buy quote requiring both approval and buy transactions in a single step.",
      },
    },
  },
};

export const BuyWithApprovalLight: Story = {
  args: {
    theme: "light",
    preparedQuote: buyWithApprovalQuote,
    paymentMethod: cryptoPaymentMethod,
    client: storyClient,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story: "Buy quote with approval and buy transactions (light theme).",
      },
    },
  },
};

export const BuyComplex: Story = {
  args: {
    theme: "dark",
    preparedQuote: complexBuyQuote,
    paymentMethod: ethCryptoPaymentMethod,
    client: storyClient,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Complex buy quote with 3 steps, each requiring approval and execution transactions across multiple chains.",
      },
    },
  },
};

export const BuyComplexLight: Story = {
  args: {
    theme: "light",
    preparedQuote: complexBuyQuote,
    paymentMethod: ethCryptoPaymentMethod,
    client: storyClient,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Complex multi-step buy quote spanning multiple chains (light theme).",
      },
    },
  },
};

// ========== TRANSACTION MODE STORIES ========== //

export const TransactionEthTransfer: Story = {
  args: {
    theme: "dark",
    preparedQuote: simpleBuyQuote,
    paymentMethod: ethCryptoPaymentMethod,
    client: storyClient,
    uiOptions: TRANSACTION_UI_OPTIONS.ethTransfer,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Transaction mode showing ETH transfer payment details with function name and contract information displayed in the PaymentDetails screen.",
      },
    },
  },
};

export const TransactionEthTransferLight: Story = {
  args: {
    theme: "light",
    preparedQuote: simpleBuyQuote,
    paymentMethod: ethCryptoPaymentMethod,
    client: storyClient,
    uiOptions: TRANSACTION_UI_OPTIONS.ethTransfer,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Light theme version of transaction mode for ETH transfer with detailed payment overview.",
      },
    },
  },
};

export const TransactionERC20Transfer: Story = {
  args: {
    theme: "dark",
    preparedQuote: simpleBuyQuote,
    paymentMethod: cryptoPaymentMethod,
    client: storyClient,
    uiOptions: TRANSACTION_UI_OPTIONS.erc20Transfer,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Transaction mode for ERC20 token transfer showing token details and transfer function in payment preview.",
      },
    },
  },
};

export const TransactionERC20TransferLight: Story = {
  args: {
    theme: "light",
    preparedQuote: simpleBuyQuote,
    paymentMethod: cryptoPaymentMethod,
    client: storyClient,
    uiOptions: TRANSACTION_UI_OPTIONS.erc20Transfer,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Light theme version of ERC20 token transfer transaction mode with payment details.",
      },
    },
  },
};

export const TransactionContractInteraction: Story = {
  args: {
    theme: "dark",
    preparedQuote: simpleBuyQuote,
    paymentMethod: ethCryptoPaymentMethod,
    client: storyClient,
    uiOptions: TRANSACTION_UI_OPTIONS.contractInteraction,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Transaction mode for complex contract interaction (claimTo function) showing detailed contract information and function details in payment preview.",
      },
    },
  },
};

export const TransactionContractInteractionLight: Story = {
  args: {
    theme: "light",
    preparedQuote: simpleBuyQuote,
    paymentMethod: ethCryptoPaymentMethod,
    client: storyClient,
    uiOptions: TRANSACTION_UI_OPTIONS.contractInteraction,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Light theme version of contract interaction transaction mode with comprehensive payment details.",
      },
    },
  },
};
