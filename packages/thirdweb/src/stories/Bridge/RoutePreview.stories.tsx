import type { Meta, StoryObj } from "@storybook/react";
import type { ThirdwebClient } from "../../client/client.js";
import type { Theme } from "../../react/core/design-system/index.js";
import type { BridgePrepareResult } from "../../react/core/hooks/useBridgePrepare.js";
import type { PaymentMethod } from "../../react/core/machines/paymentMachine.js";
import { RoutePreview } from "../../react/web/ui/Bridge/RoutePreview.js";
import { stringify } from "../../utils/json.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";
import {
  STORY_MOCK_WALLET,
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
interface RoutePreviewWithThemeProps {
  preparedQuote: BridgePrepareResult;
  paymentMethod: PaymentMethod;
  client: ThirdwebClient;
  onConfirm: () => void;
  onBack: () => void;
  onError: (error: Error) => void;
  theme: "light" | "dark" | Theme;
}

// Wrapper component to provide theme context
const RoutePreviewWithTheme = (props: RoutePreviewWithThemeProps) => {
  const { theme, ...componentProps } = props;
  return (
    <ModalThemeWrapper theme={theme}>
      <RoutePreview {...componentProps} />
    </ModalThemeWrapper>
  );
};

const meta = {
  title: "Bridge/RoutePreview",
  component: RoutePreviewWithTheme,
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
    onConfirm: () => console.log("Route confirmed"),
    onBack: () => console.log("Back clicked"),
    onError: (error) => console.error("Error:", error),
    theme: "dark",
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
} satisfies Meta<typeof RoutePreviewWithTheme>;

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
