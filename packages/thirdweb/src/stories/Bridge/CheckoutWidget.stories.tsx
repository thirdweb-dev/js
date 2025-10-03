import type { Meta, StoryObj } from "@storybook/react";
import { polygon } from "../../chains/chain-definitions/polygon.js";
import { defineChain } from "../../chains/utils.js";
import {
  CheckoutWidget,
  type CheckoutWidgetProps,
} from "../../react/web/ui/Bridge/CheckoutWidget.js";
import { storyClient } from "../utils.js";
import { DIRECT_PAYMENT_UI_OPTIONS } from "./fixtures.js";

const meta = {
  args: {
    client: storyClient,
    onCancel: () => {},
    onError: () => {},
    onSuccess: () => {},
    currency: "USD",
  },
  component: StoryVariant,
  title: "Bridge/Checkout/CheckoutWidget",
} satisfies Meta<typeof StoryVariant>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DigitalArt: Story = {
  args: {
    amount: DIRECT_PAYMENT_UI_OPTIONS.digitalArt.paymentInfo.amount,
    chain: defineChain(
      DIRECT_PAYMENT_UI_OPTIONS.digitalArt.paymentInfo.token.chainId,
    ),
    seller: DIRECT_PAYMENT_UI_OPTIONS.digitalArt.paymentInfo.sellerAddress,
    name: DIRECT_PAYMENT_UI_OPTIONS.digitalArt.metadata?.title,
    description: DIRECT_PAYMENT_UI_OPTIONS.digitalArt.metadata?.description,
    image: DIRECT_PAYMENT_UI_OPTIONS.digitalArt.metadata?.image,
    buttonLabel: DIRECT_PAYMENT_UI_OPTIONS.digitalArt.buttonLabel,
  },
};

export const DigitalArtJPCurrency: Story = {
  args: {
    amount: DIRECT_PAYMENT_UI_OPTIONS.digitalArt.paymentInfo.amount,
    chain: defineChain(
      DIRECT_PAYMENT_UI_OPTIONS.digitalArt.paymentInfo.token.chainId,
    ),
    currency: "JPY",
    seller: DIRECT_PAYMENT_UI_OPTIONS.digitalArt.paymentInfo.sellerAddress,
    name: DIRECT_PAYMENT_UI_OPTIONS.digitalArt.metadata?.title,
    description: DIRECT_PAYMENT_UI_OPTIONS.digitalArt.metadata?.description,
    image: DIRECT_PAYMENT_UI_OPTIONS.digitalArt.metadata?.image,
    buttonLabel: DIRECT_PAYMENT_UI_OPTIONS.digitalArt.buttonLabel,
  },
};

export const ConcertTicket: Story = {
  args: {
    amount: DIRECT_PAYMENT_UI_OPTIONS.concertTicket.paymentInfo.amount,
    chain: defineChain(
      DIRECT_PAYMENT_UI_OPTIONS.concertTicket.paymentInfo.token.chainId,
    ),
    seller: DIRECT_PAYMENT_UI_OPTIONS.concertTicket.paymentInfo.sellerAddress,
    name: DIRECT_PAYMENT_UI_OPTIONS.concertTicket.metadata?.title,
    description: DIRECT_PAYMENT_UI_OPTIONS.concertTicket.metadata?.description,
    image: DIRECT_PAYMENT_UI_OPTIONS.concertTicket.metadata?.image,
    buttonLabel: DIRECT_PAYMENT_UI_OPTIONS.concertTicket.buttonLabel,
  },
};

export const SubscriptionService: Story = {
  args: {
    amount: DIRECT_PAYMENT_UI_OPTIONS.subscription.paymentInfo.amount,
    chain: defineChain(
      DIRECT_PAYMENT_UI_OPTIONS.subscription.paymentInfo.token.chainId,
    ),
    seller: DIRECT_PAYMENT_UI_OPTIONS.subscription.paymentInfo.sellerAddress,
    name: DIRECT_PAYMENT_UI_OPTIONS.subscription.metadata?.title,
    description: DIRECT_PAYMENT_UI_OPTIONS.subscription.metadata?.description,
    image: DIRECT_PAYMENT_UI_OPTIONS.subscription.metadata?.image,
    buttonLabel: DIRECT_PAYMENT_UI_OPTIONS.subscription.buttonLabel,
  },
};

export const PhysicalProduct: Story = {
  args: {
    amount: DIRECT_PAYMENT_UI_OPTIONS.sneakers.paymentInfo.amount,
    chain: defineChain(
      DIRECT_PAYMENT_UI_OPTIONS.sneakers.paymentInfo.token.chainId,
    ),
    seller: DIRECT_PAYMENT_UI_OPTIONS.sneakers.paymentInfo.sellerAddress,
    name: DIRECT_PAYMENT_UI_OPTIONS.sneakers.metadata?.title,
    description: DIRECT_PAYMENT_UI_OPTIONS.sneakers.metadata?.description,
    image: DIRECT_PAYMENT_UI_OPTIONS.sneakers.metadata?.image,
    buttonLabel: DIRECT_PAYMENT_UI_OPTIONS.sneakers.buttonLabel,
  },
};

export const NoImage: Story = {
  args: {
    amount: DIRECT_PAYMENT_UI_OPTIONS.credits.paymentInfo.amount,
    chain: defineChain(
      DIRECT_PAYMENT_UI_OPTIONS.credits.paymentInfo.token.chainId,
    ),
    seller: DIRECT_PAYMENT_UI_OPTIONS.credits.paymentInfo.sellerAddress,
    name: DIRECT_PAYMENT_UI_OPTIONS.credits.metadata?.title,
    description: DIRECT_PAYMENT_UI_OPTIONS.credits.metadata?.description,
    image: DIRECT_PAYMENT_UI_OPTIONS.credits.metadata?.image,
    buttonLabel: DIRECT_PAYMENT_UI_OPTIONS.credits.buttonLabel,
  },
};

export const CustomButtonLabel: Story = {
  args: {
    amount: DIRECT_PAYMENT_UI_OPTIONS.customButton.paymentInfo.amount,
    chain: defineChain(
      DIRECT_PAYMENT_UI_OPTIONS.customButton.paymentInfo.token.chainId,
    ),
    seller: DIRECT_PAYMENT_UI_OPTIONS.customButton.paymentInfo.sellerAddress,
    name: DIRECT_PAYMENT_UI_OPTIONS.customButton.metadata?.title,
    description: DIRECT_PAYMENT_UI_OPTIONS.customButton.metadata?.description,
    image: DIRECT_PAYMENT_UI_OPTIONS.customButton.metadata?.image,
    buttonLabel: DIRECT_PAYMENT_UI_OPTIONS.customButton.buttonLabel,
  },
};

export const SmallAmount: Story = {
  args: {
    amount: "0.01",
    chain: polygon,
    seller: "0x83Dd93fA5D8343094f850f90B3fb90088C1bB425",
  },
};

function StoryVariant(props: CheckoutWidgetProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        alignItems: "center",
      }}
    >
      <CheckoutWidget {...props} theme="dark" />
      <CheckoutWidget {...props} theme="light" />
    </div>
  );
}
