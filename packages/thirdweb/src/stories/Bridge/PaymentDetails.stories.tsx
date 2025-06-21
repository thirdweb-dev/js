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
  buyWithApprovalQuote,
  complexBuyQuote,
  DIRECT_PAYMENT_UI_OPTIONS,
  longTextBuyQuote,
  onrampWithSwapsQuote,
  STORY_MOCK_WALLET,
  simpleBuyQuote,
  simpleOnrampQuote,
  TRANSACTION_UI_OPTIONS,
  USDC,
} from "./fixtures.js";

const fiatPaymentMethod: PaymentMethod = {
  currency: "USD",
  onramp: "coinbase",
  payerWallet: STORY_MOCK_WALLET,
  type: "fiat",
};

const cryptoPaymentMethod: PaymentMethod = JSON.parse(
  stringify({
    balance: 100000000n,
    originToken: {
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      chainId: 1,
      decimals: 6,
      iconUri:
        "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
      name: "USD Coin",
      priceUsd: 1.0,
      symbol: "USDC",
    },
    payerWallet: STORY_MOCK_WALLET,
    type: "wallet",
  }),
);

const ethCryptoPaymentMethod: PaymentMethod = JSON.parse(
  stringify({
    balance: 1000000000000000000n,
    originToken: {
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      chainId: 1,
      decimals: 18,
      iconUri:
        "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
      name: "Ethereum",
      priceUsd: 2500.0,
      symbol: "ETH",
    },
    payerWallet: STORY_MOCK_WALLET,
    type: "wallet",
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
  args: {
    onBack: () => {},
    onConfirm: () => {},
    onError: (error) => console.error("Error:", error),
    preparedQuote: simpleOnrampQuote,
    theme: "dark",
    uiOptions: {
      destinationToken: USDC,
      mode: "fund_wallet",
    },
  },
  argTypes: {
    onBack: { action: "back clicked" },
    onConfirm: { action: "route confirmed" },
    onError: { action: "error occurred" },
    theme: {
      control: "select",
      description: "Theme for the component",
      options: ["light", "dark"],
    },
  },
  component: PaymentDetailsWithTheme,
  parameters: {
    docs: {
      description: {
        component:
          "Route preview screen that displays prepared quote details, fees, estimated time, and transaction steps for user confirmation.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Bridge/PaymentDetails",
} satisfies Meta<typeof PaymentDetailsWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnrampSimple: Story = {
  args: {
    client: storyClient,
    paymentMethod: fiatPaymentMethod,
    preparedQuote: simpleOnrampQuote,
    theme: "dark",
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
    client: storyClient,
    paymentMethod: fiatPaymentMethod,
    preparedQuote: simpleOnrampQuote,
    theme: "light",
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
    client: storyClient,
    paymentMethod: fiatPaymentMethod,
    preparedQuote: simpleOnrampQuote,
    theme: "dark",
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
    client: storyClient,
    paymentMethod: fiatPaymentMethod,
    preparedQuote: simpleOnrampQuote,
    theme: "light",
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
    client: storyClient,
    paymentMethod: fiatPaymentMethod,
    preparedQuote: onrampWithSwapsQuote,
    theme: "dark",
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
    client: storyClient,
    paymentMethod: fiatPaymentMethod,
    preparedQuote: onrampWithSwapsQuote,
    theme: "light",
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
    client: storyClient,
    paymentMethod: ethCryptoPaymentMethod,
    preparedQuote: simpleBuyQuote,
    theme: "dark",
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
    client: storyClient,
    paymentMethod: ethCryptoPaymentMethod,
    preparedQuote: simpleBuyQuote,
    theme: "light",
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
    client: storyClient,
    paymentMethod: ethCryptoPaymentMethod,
    preparedQuote: simpleBuyQuote,
    theme: "dark",
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
    client: storyClient,
    paymentMethod: ethCryptoPaymentMethod,
    preparedQuote: simpleBuyQuote,
    theme: "light",
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
    client: storyClient,
    paymentMethod: ethCryptoPaymentMethod,
    preparedQuote: longTextBuyQuote,
    theme: "dark",
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
    client: storyClient,
    paymentMethod: cryptoPaymentMethod,
    preparedQuote: buyWithApprovalQuote,
    theme: "dark",
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
    client: storyClient,
    paymentMethod: cryptoPaymentMethod,
    preparedQuote: buyWithApprovalQuote,
    theme: "light",
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
    client: storyClient,
    paymentMethod: ethCryptoPaymentMethod,
    preparedQuote: complexBuyQuote,
    theme: "dark",
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
    client: storyClient,
    paymentMethod: ethCryptoPaymentMethod,
    preparedQuote: complexBuyQuote,
    theme: "light",
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
    client: storyClient,
    paymentMethod: ethCryptoPaymentMethod,
    preparedQuote: simpleBuyQuote,
    theme: "dark",
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
    client: storyClient,
    paymentMethod: ethCryptoPaymentMethod,
    preparedQuote: simpleBuyQuote,
    theme: "light",
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
    client: storyClient,
    paymentMethod: cryptoPaymentMethod,
    preparedQuote: simpleBuyQuote,
    theme: "dark",
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
    client: storyClient,
    paymentMethod: cryptoPaymentMethod,
    preparedQuote: simpleBuyQuote,
    theme: "light",
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
    client: storyClient,
    paymentMethod: ethCryptoPaymentMethod,
    preparedQuote: simpleBuyQuote,
    theme: "dark",
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
    client: storyClient,
    paymentMethod: ethCryptoPaymentMethod,
    preparedQuote: simpleBuyQuote,
    theme: "light",
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
