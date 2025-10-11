import type { Meta, StoryObj } from "@storybook/react";
import { PaymentDetails } from "../../react/web/ui/Bridge/payment-details/PaymentDetails.js";
import type { PaymentMethod } from "../../react/web/ui/Bridge/types.js";
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

const meta: Meta<typeof PaymentDetails> = {
  args: {
    onBack: () => {},
    onConfirm: () => {},
    onError: (error) => console.error("Error:", error),
    preparedQuote: simpleOnrampQuote,
    modeInfo: {
      mode: "fund_wallet",
    },
    currency: "USD",
    metadata: {
      title: undefined,
      description: undefined,
    },
    client: storyClient,
    confirmButtonLabel: undefined,
  },
  decorators: [
    (Story) => (
      <ModalThemeWrapper>
        <Story />
      </ModalThemeWrapper>
    ),
  ],
  component: PaymentDetails,
  title: "Bridge/screens/PaymentDetails",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const OnrampSimple: Story = {
  args: {
    paymentMethod: fiatPaymentMethod,
    preparedQuote: simpleOnrampQuote,
  },
};

export const OnrampSimpleDirectPayment: Story = {
  args: {
    paymentMethod: fiatPaymentMethod,
    preparedQuote: simpleOnrampQuote,
    ...DIRECT_PAYMENT_UI_OPTIONS.credits,
  },
};

export const OnrampWithSwaps: Story = {
  args: {
    paymentMethod: fiatPaymentMethod,
    preparedQuote: onrampWithSwapsQuote,
  },
};

export const BuySimple: Story = {
  args: {
    paymentMethod: ethCryptoPaymentMethod,
    preparedQuote: simpleBuyQuote,
  },
};

export const BuySimpleDirectPayment: Story = {
  args: {
    paymentMethod: ethCryptoPaymentMethod,
    preparedQuote: simpleBuyQuote,
    ...DIRECT_PAYMENT_UI_OPTIONS.digitalArt,
  },
};

export const BuyWithLongText: Story = {
  args: {
    paymentMethod: ethCryptoPaymentMethod,
    preparedQuote: longTextBuyQuote,
  },
};

export const BuyWithApproval: Story = {
  args: {
    paymentMethod: cryptoPaymentMethod,
    preparedQuote: buyWithApprovalQuote,
  },
};

export const BuyComplex: Story = {
  args: {
    paymentMethod: ethCryptoPaymentMethod,
    preparedQuote: complexBuyQuote,
  },
};

// ========== TRANSACTION MODE STORIES ========== //

export const TransactionEthTransfer: Story = {
  args: {
    paymentMethod: ethCryptoPaymentMethod,
    preparedQuote: simpleBuyQuote,
    modeInfo: {
      mode: "transaction",
      transaction: TRANSACTION_UI_OPTIONS.ethTransfer.transaction,
    },
    ...TRANSACTION_UI_OPTIONS.ethTransfer,
  },
};

export const TransactionERC20Transfer: Story = {
  args: {
    paymentMethod: cryptoPaymentMethod,
    preparedQuote: simpleBuyQuote,
    modeInfo: {
      mode: "transaction",
      transaction: TRANSACTION_UI_OPTIONS.erc20Transfer.transaction,
    },
    ...TRANSACTION_UI_OPTIONS.erc20Transfer,
  },
};

export const TransactionContractInteraction: Story = {
  args: {
    paymentMethod: ethCryptoPaymentMethod,
    preparedQuote: simpleBuyQuote,
    modeInfo: {
      mode: "transaction",
      transaction: TRANSACTION_UI_OPTIONS.contractInteraction.transaction,
    },
    ...TRANSACTION_UI_OPTIONS.contractInteraction,
  },
};
