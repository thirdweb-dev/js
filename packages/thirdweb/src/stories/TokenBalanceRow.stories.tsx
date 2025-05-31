import type { Meta, StoryObj } from "@storybook/react";
import { createWalletAdapter } from "../adapters/wallet-adapter.js";
import { base } from "../chains/chain-definitions/base.js";
import { ethereum } from "../chains/chain-definitions/ethereum.js";
import { optimism } from "../chains/chain-definitions/optimism.js";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../constants/addresses.js";
import { CustomThemeProvider } from "../react/core/design-system/CustomThemeProvider.js";
import type { Theme } from "../react/core/design-system/index.js";
import {
  type TokenInfo,
  getDefaultToken,
} from "../react/core/utils/defaultTokens.js";
import { TokenBalanceRow } from "../react/web/ui/Bridge/TokenBalanceRow.js";
import type { Wallet } from "../wallets/interfaces/wallet.js";
import { privateKeyToAccount } from "../wallets/private-key.js";
import type { GetWalletBalanceResult } from "../wallets/utils/getWalletBalance.js";
import { storyClient } from "./utils.js";

// Props interface for the wrapper component
interface TokenBalanceRowWithThemeProps {
  client: ThirdwebClient;
  token: TokenInfo;
  chain: Chain;
  balance: GetWalletBalanceResult;
  wallet: Wallet;
  onClick: (token: TokenInfo, wallet: Wallet) => void;
  style?: React.CSSProperties;
  theme: "light" | "dark" | Theme;
}

// Dummy data
const dummyTokenETH: TokenInfo = {
  address: "0x0000000000000000000000000000000000000000",
  name: "Ethereum",
  symbol: "ETH",
  icon: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png",
};

const dummyTokenUSDC: TokenInfo = {
  address: getDefaultToken(base, "USDC")?.address ?? "",
  name: "USD Coin",
  symbol: "USDC",
  icon: "https://coin-images.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
};

const dummyTokenUNI: TokenInfo = {
  address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  name: "Uniswap",
  symbol: "UNI",
  icon: "https://coin-images.coingecko.com/coins/images/12504/large/uniswap-uni.png",
};

const dummyBalanceETH: GetWalletBalanceResult = {
  decimals: 18,
  displayValue: "1.2345",
  name: "Ethereum",
  symbol: "ETH",
  // @ts-expect-error - needs to be a string for storybook serialization
  value: "1234500000000000000",
  tokenAddress: NATIVE_TOKEN_ADDRESS,
  chainId: 1,
};

const dummyBalanceUSDC: GetWalletBalanceResult = {
  decimals: 6,
  displayValue: "1234.56",
  name: "USD Coin",
  symbol: "USDC",
  // @ts-expect-error - needs to be a string for storybook serialization
  value: "1234560000",
};

const dummyBalanceLowUNI: GetWalletBalanceResult = {
  decimals: 18,
  displayValue: "0.0012",
  name: "Uniswap",
  symbol: "UNI",
  // @ts-expect-error - needs to be a string for storybook serialization
  value: "1200000000000000",
};

const dummyWallet: Wallet = createWalletAdapter({
  adaptedAccount: privateKeyToAccount({
    client: storyClient,
    privateKey:
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  }),
  client: storyClient,
  chain: ethereum,
  onDisconnect: () => {},
  switchChain: () => {},
});

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
    token: dummyTokenETH,
    chain: ethereum,
    balance: dummyBalanceETH,
    wallet: dummyWallet,
    onClick: (token: TokenInfo, wallet: Wallet) => {
      console.log("Token selected:", token.symbol, "from wallet:", wallet.id);
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
          token={dummyTokenETH}
          chain={ethereum}
          balance={dummyBalanceETH}
          wallet={dummyWallet}
          onClick={args.onClick}
        />
        <TokenBalanceRow
          client={args.client}
          token={dummyTokenETH}
          chain={base}
          balance={dummyBalanceETH}
          wallet={dummyWallet}
          onClick={args.onClick}
        />
        <TokenBalanceRow
          client={args.client}
          token={dummyTokenUSDC}
          chain={base}
          balance={dummyBalanceUSDC}
          wallet={dummyWallet}
          onClick={args.onClick}
        />
        <TokenBalanceRow
          client={args.client}
          token={dummyTokenUNI}
          chain={optimism}
          balance={dummyBalanceLowUNI}
          wallet={dummyWallet}
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
          token={dummyTokenETH}
          chain={ethereum}
          balance={dummyBalanceETH}
          wallet={dummyWallet}
          onClick={args.onClick}
        />
        <TokenBalanceRow
          client={args.client}
          token={dummyTokenUSDC}
          chain={base}
          balance={dummyBalanceUSDC}
          wallet={dummyWallet}
          onClick={args.onClick}
        />
        <TokenBalanceRow
          client={args.client}
          token={dummyTokenUNI}
          chain={optimism}
          balance={dummyBalanceLowUNI}
          wallet={dummyWallet}
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
