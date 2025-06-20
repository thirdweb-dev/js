import type { Meta, StoryObj } from "@storybook/react";
import type { ThirdwebClient } from "../client/client.js";
import { CustomThemeProvider } from "../react/core/design-system/CustomThemeProvider.js";
import type { Theme } from "../react/core/design-system/index.js";
import { WalletRow } from "../react/web/ui/ConnectWallet/screens/Buy/swap/WalletRow.js";
import { storyClient } from "./utils.js";

// Props interface for the wrapper component
interface WalletRowWithThemeProps {
  client: ThirdwebClient;
  address: string;
  iconSize?: "xs" | "sm" | "md" | "lg" | "xl";
  textSize?: "xs" | "sm" | "md" | "lg" | "xl";
  label?: string;
  theme: "light" | "dark" | Theme;
}

// Wrapper component to provide theme context
const WalletRowWithTheme = (props: WalletRowWithThemeProps) => {
  const { theme, ...walletRowProps } = props;
  return (
    <CustomThemeProvider theme={theme}>
      <WalletRow {...walletRowProps} />
    </CustomThemeProvider>
  );
};

const meta = {
  args: {
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    client: storyClient, // Vitalik's address for ENS demo
    theme: "dark",
  },
  argTypes: {
    address: {
      control: "text",
      description: "Wallet address to display",
    },
    iconSize: {
      control: "select",
      description: "Size of the wallet icon",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    label: {
      control: "text",
      description: "Optional label to display above the address",
    },
    textSize: {
      control: "select",
      description: "Size of the main address text",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    theme: {
      control: "select",
      description: "Theme for the component",
      options: ["light", "dark"],
    },
  },
  component: WalletRowWithTheme,
  parameters: {
    docs: {
      description: {
        component:
          "A reusable component that displays wallet information including address, wallet type, and optional ENS name or email.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Connect/WalletRow",
} satisfies Meta<typeof WalletRowWithTheme>;

type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const Dark: Story = {
  args: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithLabel: Story = {
  args: {
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    label: "Recipient Wallet",
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const LargeSize: Story = {
  args: {
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    iconSize: "lg",
    label: "Primary Wallet",
    textSize: "md",
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const SmallSize: Story = {
  args: {
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    iconSize: "sm",
    textSize: "xs",
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DifferentAddresses: Story = {
  args: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: (args) => (
    <CustomThemeProvider theme={args.theme}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          minWidth: "300px",
        }}
      >
        <WalletRow
          address="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
          client={args.client}
          label="ENS Example (vitalik.eth)"
        />
        <WalletRow
          address="0x4fA9230f4E8978462cE7Bf8e6b5a2588da5F4264"
          client={args.client}
          label="Regular Address"
        />
        <WalletRow
          address="0x4fA9230f4E8978462cE7Bf8e6b5a2588da5F4264"
          client={args.client}
          label="Short Address"
        />
      </div>
    </CustomThemeProvider>
  ),
};

export default meta;
