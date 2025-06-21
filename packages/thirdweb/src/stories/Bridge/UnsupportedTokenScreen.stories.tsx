import type { Meta, StoryObj } from "@storybook/react";
import { defineChain } from "../../chains/utils.js";
import type { Theme } from "../../react/core/design-system/index.js";
import {
  UnsupportedTokenScreen,
  type UnsupportedTokenScreenProps,
} from "../../react/web/ui/Bridge/UnsupportedTokenScreen.js";
import { ModalThemeWrapper } from "../utils.js";

// Props interface for the wrapper component
interface UnsupportedTokenScreenWithThemeProps
  extends UnsupportedTokenScreenProps {
  theme: "light" | "dark" | Theme;
}

// Wrapper component to provide theme context
const UnsupportedTokenScreenWithTheme = (
  props: UnsupportedTokenScreenWithThemeProps,
) => {
  const { theme, ...componentProps } = props;
  return (
    <ModalThemeWrapper theme={theme}>
      <UnsupportedTokenScreen {...componentProps} />
    </ModalThemeWrapper>
  );
};

const meta = {
  args: {
    chain: defineChain(1), // Ethereum mainnet
    theme: "dark",
  },
  argTypes: {
    theme: {
      control: "select",
      description: "Theme for the component",
      options: ["light", "dark"],
    },
  },
  component: UnsupportedTokenScreenWithTheme,
  parameters: {
    docs: {
      description: {
        component:
          "Screen displayed when a token is being indexed or when using an unsupported testnet. Shows loading state for indexing tokens or error state for testnets.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Bridge/UnsupportedTokenScreen",
} satisfies Meta<typeof UnsupportedTokenScreenWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TokenNotSupported: Story = {
  args: {
    chain: defineChain(1),
    theme: "dark", // Ethereum mainnet - will show indexing spinner
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Shows the loading state when a token is being indexed by the Universal Bridge on a mainnet chain.",
      },
    },
  },
};

export const TokenNotSupportedLight: Story = {
  args: {
    chain: defineChain(1),
    theme: "light", // Ethereum mainnet - will show indexing spinner
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Shows the loading state when a token is being indexed by the Universal Bridge on a mainnet chain (light theme).",
      },
    },
  },
};

export const TestnetNotSupported: Story = {
  args: {
    chain: defineChain(11155111),
    theme: "dark", // Sepolia testnet - will show error state
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Shows the error state when trying to use the Universal Bridge on a testnet chain (Sepolia in this example).",
      },
    },
  },
};

export const TestnetNotSupportedLight: Story = {
  args: {
    chain: defineChain(11155111),
    theme: "light", // Sepolia testnet - will show error state
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Shows the error state when trying to use the Universal Bridge on a testnet chain (Sepolia in this example, light theme).",
      },
    },
  },
};
