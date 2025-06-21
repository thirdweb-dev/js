import type { Meta, StoryObj } from "@storybook/react";
import type { Token } from "../bridge/index.js";
import { ethereum } from "../chains/chain-definitions/ethereum.js";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { CustomThemeProvider } from "../react/core/design-system/CustomThemeProvider.js";
import type { Theme } from "../react/core/design-system/index.js";
import { TokenBalanceRow } from "../react/web/ui/Bridge/common/TokenBalanceRow.js";
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
  args: {
    amount: dummyBalanceETH,
    chain: ethereum,
    client: storyClient,
    onClick: (_token: Token) => {},
    theme: "dark",
    token: ETH,
  },
  argTypes: {
    onClick: {
      action: "clicked",
      description: "Callback function when token row is clicked",
    },
    theme: {
      control: "select",
      description: "Theme for the component",
      options: ["light", "dark"],
    },
  },
  component: TokenBalanceRowWithTheme,
  parameters: {
    docs: {
      description: {
        component:
          "A row component that displays token balance information including token icon, symbol, chain, balance amount and fiat value. Used in bridge interfaces for token selection.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Bridge/TokenBalanceRow",
} satisfies Meta<typeof TokenBalanceRowWithTheme>;

type Story = StoryObj<typeof meta>;

export const TokenList: Story = {
  args: {
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
  render: (args) => (
    <CustomThemeProvider theme={args.theme}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          maxWidth: "500px",
          minWidth: "400px",
        }}
      >
        <TokenBalanceRow
          amount={dummyBalanceETH}
          client={args.client}
          onClick={args.onClick}
          token={ETH}
        />
        <TokenBalanceRow
          amount={dummyBalanceETH}
          client={args.client}
          onClick={args.onClick}
          token={ETH}
        />
        <TokenBalanceRow
          amount={dummyBalanceUSDC}
          client={args.client}
          onClick={args.onClick}
          token={USDC}
        />
        <TokenBalanceRow
          amount={dummyBalanceLowUNI}
          client={args.client}
          onClick={args.onClick}
          token={UNI}
        />
      </div>
    </CustomThemeProvider>
  ),
};

export const DarkTokenList: Story = {
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
          gap: "8px",
          maxWidth: "500px",
          minWidth: "400px",
        }}
      >
        <TokenBalanceRow
          amount={dummyBalanceETH}
          client={args.client}
          onClick={args.onClick}
          token={ETH}
        />
        <TokenBalanceRow
          amount={dummyBalanceETH}
          client={args.client}
          onClick={args.onClick}
          token={ETH}
        />
        <TokenBalanceRow
          amount={dummyBalanceUSDC}
          client={args.client}
          onClick={args.onClick}
          token={USDC}
        />
        <TokenBalanceRow
          amount={dummyBalanceLowUNI}
          client={args.client}
          onClick={args.onClick}
          token={UNI}
        />
      </div>
    </CustomThemeProvider>
  ),
};

export default meta;
