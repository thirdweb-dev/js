import type { Meta, StoryObj } from "@storybook/react";
import { PaymentSelection } from "../../react/web/ui/Bridge/payment-selection/PaymentSelection.js";
import en from "../../react/web/ui/ConnectWallet/locale/en.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";
import { USDC } from "./fixtures.js";

const meta: Meta<typeof PaymentSelection> = {
  args: {
    client: storyClient,
    onBack: () => {
      alert("Back");
    },
    connectLocale: en,
    destinationAmount: "1",
    destinationToken: USDC,
    onError: (error) => console.error("Error:", error),
    onPaymentMethodSelected: () => {},
    country: "US",
    connectOptions: undefined,
    currency: "USD",
    paymentMethods: ["crypto", "card"],
    receiverAddress: "0x0000000000000000000000000000000000000000",
    feePayer: undefined,
    supportedTokens: undefined,
  },
  decorators: [
    (Story) => (
      <ModalThemeWrapper>
        <Story />
      </ModalThemeWrapper>
    ),
  ],
  component: PaymentSelection,
  title: "Bridge/screens/PaymentSelection",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const OnlyCryptoMethodEnabled: Story = {
  args: {
    paymentMethods: ["crypto"],
  },
};

export const OnlyFiatMethodEnabled: Story = {
  args: {
    paymentMethods: ["card"],
  },
};
