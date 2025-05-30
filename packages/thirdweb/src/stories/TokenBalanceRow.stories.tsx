import type { Meta, StoryObj } from "@storybook/react";
import type { Token } from "../bridge/index.js";
import { ethereum } from "../chains/chain-definitions/ethereum.js";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { CustomThemeProvider } from "../react/core/design-system/CustomThemeProvider.js";
import type { Theme } from "../react/core/design-system/index.js";
import { TokenBalanceRow } from "../react/web/ui/Bridge/TokenBalanceRow.js";
import { ETH, UNI, USDC } from "./Bridge/fixtures.js";
import { storyClient } from "./utils.js";

// Props interface for the wrapper component
interface TokenBalanceRowWithThemeProps {
  client: ThirdwebClient;
  token: Token;
  chain: Chain;
  amount: string;
  onClick: (token: Token) => void;
  style?: React.CSSProperties;
  theme: "light" | "dark" | Theme;
}

const dummyBalanceETH: string = "1.2345";

const dummyBalanceUSDC: string = "1234.56";

const dummyBalanceLowUNI: string = "0.0012";

// Wrapper component to provide theme context
const TokenBalanceRowWithTheme = (props: TokenBalanceRowWithThemeProps) => {
  const { theme, ...tokenBalanceRowProps } = props;
  return (
    <CustomThemeProvider theme={theme}>
      <TokenBalanceRow {...tokenBalanceRowProps} />
    </CustomThemeProvider>
  );
};

const meta = {
  title: "Bridge/TokenBalanceRow",
  component: TokenBalanceRowWithTheme,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A row component that displays token balance information including token icon, symbol, chain, balance amount and fiat value. Used in bridge interfaces for token selection.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    client: storyClient,
    token: ETH,
    chain: ethereum,
    amount: dummyBalanceETH,
    onClick: (token: Token) => {
      console.log("Token selected:", token.symbol);
    },
    theme: "dark",
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Theme for the component",
    },
    onClick: {
      action: "clicked",
      description: "Callback function when token row is clicked",
    },
  },
} satisfies Meta<typeof TokenBalanceRowWithTheme>;

type Story = StoryObj<typeof meta>;

export const TokenList: Story = {
  render: (args) => (
    <CustomThemeProvider theme={args.theme}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minWidth: "400px",
          maxWidth: "500px",
        }}
      >
        <TokenBalanceRow
          client={args.client}
          token={ETH}
          amount={dummyBalanceETH}
          onClick={args.onClick}
        />
        <TokenBalanceRow
          client={args.client}
          token={ETH}
          amount={dummyBalanceETH}
          onClick={args.onClick}
        />
        <TokenBalanceRow
          client={args.client}
          token={USDC}
          amount={dummyBalanceUSDC}
          onClick={args.onClick}
        />
        <TokenBalanceRow
          client={args.client}
          token={UNI}
          amount={dummyBalanceLowUNI}
          onClick={args.onClick}
        />
      </div>
    </CustomThemeProvider>
  ),
  args: {
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const DarkTokenList: Story = {
  render: (args) => (
    <CustomThemeProvider theme={args.theme}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minWidth: "400px",
          maxWidth: "500px",
        }}
      >
        <TokenBalanceRow
          client={args.client}
          token={ETH}
          amount={dummyBalanceETH}
          onClick={args.onClick}
        />
        <TokenBalanceRow
          client={args.client}
          token={ETH}
          amount={dummyBalanceETH}
          onClick={args.onClick}
        />
        <TokenBalanceRow
          client={args.client}
          token={USDC}
          amount={dummyBalanceUSDC}
          onClick={args.onClick}
        />
        <TokenBalanceRow
          client={args.client}
          token={UNI}
          amount={dummyBalanceLowUNI}
          onClick={args.onClick}
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
