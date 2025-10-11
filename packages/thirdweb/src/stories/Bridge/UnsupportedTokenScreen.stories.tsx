import type { Meta, StoryObj } from "@storybook/react";
import { defineChain } from "../../chains/utils.js";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/addresses.js";
import { UnsupportedTokenScreen } from "../../react/web/ui/Bridge/UnsupportedTokenScreen.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";

const meta: Meta<typeof UnsupportedTokenScreen> = {
  args: {
    client: storyClient,
    chain: defineChain(1),
    tokenAddress: NATIVE_TOKEN_ADDRESS,
  },
  component: UnsupportedTokenScreen,
  title: "Bridge/screens/UnsupportedTokenScreen",
  decorators: [
    (Story) => (
      <ModalThemeWrapper>
        <Story />
      </ModalThemeWrapper>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TokenNotSupported: Story = {
  args: {
    chain: defineChain(1),
  },
};

export const TestnetNotSupported: Story = {
  args: {
    chain: defineChain(11155111), // Sepolia testnet
  },
};
