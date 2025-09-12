import type { Meta } from "@storybook/react-vite";
import { base } from "../chains/chain-definitions/base.js";
import { defineChain } from "../chains/utils.js";
import { BuyWidget } from "../react/web/ui/Bridge/BuyWidget.js";
import { storyClient } from "./utils.js";

const meta = {
  parameters: {
    layout: "centered",
  },
  title: "Connect/BuyWidget",
} satisfies Meta<typeof BuyWidget>;
export default meta;

export function BasicUsage() {
  return <BuyWidget client={storyClient} chain={base} amount="0.1" />;
}

export function UnsupportedChain() {
  return (
    <BuyWidget client={storyClient} chain={defineChain(84532)} amount="0.1" />
  );
}

export function UnsupportedToken() {
  return (
    <BuyWidget
      client={storyClient}
      chain={base}
      amount="0.1"
      tokenAddress="0xc3e13Ecf3B6C2Aa0F2Eb5e898De02d704352Aa54" // this is actually NFT
    />
  );
}
