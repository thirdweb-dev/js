import type { Meta } from "@storybook/react-vite";
import { base } from "../chains/chain-definitions/base.js";
import { ethereum } from "../chains/chain-definitions/ethereum.js";
import { defineChain } from "../chains/utils.js";
import { BuyWidget } from "../react/web/ui/Bridge/BuyWidget.js";
import { storyClient } from "./utils.js";

const meta = {
  parameters: {
    layout: "centered",
  },
  title: "Bridge/Buy/BuyWidget",
} satisfies Meta<typeof BuyWidget>;
export default meta;

export function BuyBaseNativeToken() {
  return <BuyWidget client={storyClient} chain={base} amount="0.1" />;
}

export function BuyBaseUSDC() {
  return (
    <BuyWidget
      client={storyClient}
      chain={base}
      amount="0.1"
      tokenAddress="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
    />
  );
}

export function CustomTitleDescriptionAndButtonLabel() {
  return (
    <BuyWidget
      client={storyClient}
      title="Custom Title"
      description="Custom Description"
      chain={base}
      amount="0.1"
      tokenAddress="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
      buttonLabel="Custom Button Label"
    />
  );
}

export function HideTitle() {
  return (
    <BuyWidget
      client={storyClient}
      title=""
      chain={base}
      amount="0.1"
      tokenAddress="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
    />
  );
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

export function OnlyCardSupported() {
  return (
    <BuyWidget
      client={storyClient}
      chain={base}
      amount="0.1"
      paymentMethods={["card"]}
    />
  );
}

export function OnlyCryptoSupported() {
  return (
    <BuyWidget
      client={storyClient}
      chain={base}
      amount="0.1"
      paymentMethods={["crypto"]}
    />
  );
}

export function LargeAmount() {
  return (
    <BuyWidget
      client={storyClient}
      chain={ethereum}
      tokenAddress="0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
      amount="150000"
    />
  );
}
