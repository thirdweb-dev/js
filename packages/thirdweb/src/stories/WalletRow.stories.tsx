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
  title: "Connect/WalletRow",
  component: WalletRowWithTheme,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A reusable component that displays wallet information including address, wallet type, and optional ENS name or email.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    client: storyClient,
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // Vitalik's address for ENS demo
    theme: "dark",
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Theme for the component",
    },
    iconSize: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Size of the wallet icon",
    },
    textSize: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Size of the main address text",
    },
    label: {
      control: "text",
      description: "Optional label to display above the address",
    },
    address: {
      control: "text",
      description: "Wallet address to display",
    },
  },
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
    theme: "dark",
    label: "Recipient Wallet",
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const LargeSize: Story = {
  args: {
    theme: "light",
    iconSize: "lg",
    textSize: "md",
    label: "Primary Wallet",
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const SmallSize: Story = {
  args: {
    theme: "dark",
    iconSize: "sm",
    textSize: "xs",
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DifferentAddresses: Story = {
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
          client={args.client}
          address="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
          label="ENS Example (vitalik.eth)"
        />
        <WalletRow
          client={args.client}
          address="0x4fA9230f4E8978462cE7Bf8e6b5a2588da5F4264"
          label="Regular Address"
        />
        <WalletRow
          client={args.client}
          address="0x4fA9230f4E8978462cE7Bf8e6b5a2588da5F4264"
          label="Short Address"
        />
      </div>
    </CustomThemeProvider>
  ),
  args: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export default meta;
