import type { Meta, StoryObj } from "@storybook/react";
import type { Theme } from "../../react/core/design-system/index.js";
import { FundWallet } from "../../react/web/ui/Bridge/FundWallet.js";
import type { FundWalletProps } from "../../react/web/ui/Bridge/FundWallet.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";
import { FUND_WALLET_UI_OPTIONS, RECEIVER_ADDRESSES } from "./fixtures.js";

// Props interface for the wrapper component
interface FundWalletWithThemeProps extends FundWalletProps {
  theme: "light" | "dark" | Theme;
}

// Wrapper component to provide theme context
const FundWalletWithTheme = (props: FundWalletWithThemeProps) => {
  const { theme, ...componentProps } = props;
  return (
    <ModalThemeWrapper theme={theme}>
      <FundWallet {...componentProps} />
    </ModalThemeWrapper>
  );
};

const meta = {
  title: "Bridge/FundWallet",
  component: FundWalletWithTheme,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "FundWallet component allows users to specify the amount they want to add to their wallet. This is the first screen in the fund_wallet flow before method selection.\n\n" +
          "## Features\n" +
          "- **Token Selection**: Choose from different tokens (ETH, USDC, UNI)\n" +
          "- **Amount Input**: Enter custom amount or use quick options\n" +
          "- **Receiver Address**: Optional receiver address (defaults to connected wallet)\n" +
          "- **Quick Options**: Preset amounts for faster selection\n" +
          "- **Theme Support**: Works with both light and dark themes\n\n" +
          "This component now accepts uiOptions directly to configure the destination token, initial amount, and quick options.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    uiOptions: FUND_WALLET_UI_OPTIONS.ethDefault,
    client: storyClient,
    onContinue: (amount, token, receiverAddress) => {
      alert(`Continue with ${amount} ${token.symbol} to ${receiverAddress}`);
    },
    receiverAddress: RECEIVER_ADDRESSES.primary,
    theme: "dark",
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Theme for the component",
    },
    onContinue: { action: "continue clicked" },
    uiOptions: {
      description: "UI configuration for fund wallet mode",
    },
    receiverAddress: {
      description: "Optional receiver address (defaults to connected wallet)",
    },
  },
} satisfies Meta<typeof FundWalletWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    theme: "light",
    uiOptions: FUND_WALLET_UI_OPTIONS.ethDefault,
    receiverAddress: undefined,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story: "Default fund wallet interface in light theme with ETH token.",
      },
    },
  },
};

export const Dark: Story = {
  args: {
    theme: "dark",
    uiOptions: FUND_WALLET_UI_OPTIONS.ethDefault,
    receiverAddress: undefined,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story: "Default fund wallet interface in dark theme with ETH token.",
      },
    },
  },
};

export const WithInitialAmount: Story = {
  args: {
    theme: "dark",
    uiOptions: FUND_WALLET_UI_OPTIONS.ethWithAmount,
    receiverAddress: RECEIVER_ADDRESSES.secondary,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Fund wallet with pre-filled amount and specified receiver address.",
      },
    },
  },
};

export const WithInitialAmountLight: Story = {
  args: {
    theme: "light",
    uiOptions: FUND_WALLET_UI_OPTIONS.ethWithAmount,
    receiverAddress: RECEIVER_ADDRESSES.secondary,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Light theme version with pre-filled amount and receiver address.",
      },
    },
  },
};

export const USDCToken: Story = {
  args: {
    theme: "dark",
    uiOptions: FUND_WALLET_UI_OPTIONS.usdcDefault,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story: "Fund wallet configured for USDC token with initial amount.",
      },
    },
  },
};

export const USDCTokenLight: Story = {
  args: {
    theme: "light",
    uiOptions: FUND_WALLET_UI_OPTIONS.usdcDefault,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story: "Light theme version for USDC token funding.",
      },
    },
  },
};

export const LargeAmount: Story = {
  args: {
    theme: "dark",
    uiOptions: FUND_WALLET_UI_OPTIONS.uniLarge,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Fund wallet with UNI token and large pre-filled amount to test formatting.",
      },
    },
  },
};

export const LargeAmountLight: Story = {
  args: {
    theme: "light",
    uiOptions: FUND_WALLET_UI_OPTIONS.uniLarge,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story: "Light theme version with UNI token and large amount.",
      },
    },
  },
};
