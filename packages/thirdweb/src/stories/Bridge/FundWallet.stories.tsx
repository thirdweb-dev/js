import type { Meta, StoryObj } from "@storybook/react";
import type { Theme } from "../../react/core/design-system/index.js";
import { FundWallet } from "../../react/web/ui/Bridge/FundWallet.js";
import type { FundWalletProps } from "../../react/web/ui/Bridge/FundWallet.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";
import { ETH, UNI, USDC } from "./fixtures.js";

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
          "FundWallet component allows users to specify the amount they want to add to their wallet. This is the first screen in the fund_wallet flow before method selection.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    token: ETH,
    client: storyClient,
    onContinue: (amount, token, chain) => {
      console.log("Continue clicked:", { amount, token, chain });
      alert(`Continue with ${amount} ${token.symbol} on ${chain.name}`);
    },
    receiverAddress: "0x2247d5d238d0f9d37184d8332aE0289d1aD9991b",
    theme: "dark",
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Theme for the component",
    },
    onContinue: { action: "continue clicked" },
  },
} satisfies Meta<typeof FundWalletWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    theme: "light",
    receiverAddress: undefined,
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const Dark: Story = {
  args: {
    theme: "dark",
    receiverAddress: undefined,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithInitialAmount: Story = {
  args: {
    theme: "dark",
    initialAmount: "0.001",
    receiverAddress: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithInitialAmountLight: Story = {
  args: {
    theme: "light",
    initialAmount: "0.001",
    receiverAddress: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const DifferentToken: Story = {
  args: {
    theme: "dark",
    token: USDC,
    initialAmount: "5",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DifferentTokenLight: Story = {
  args: {
    theme: "light",
    token: USDC,
    initialAmount: "5",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const ArbitrumChain: Story = {
  args: {
    theme: "dark",
    token: UNI,
    initialAmount: "150000",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const ArbitrumChainLight: Story = {
  args: {
    theme: "light",
    token: UNI,
    initialAmount: "150000",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};
