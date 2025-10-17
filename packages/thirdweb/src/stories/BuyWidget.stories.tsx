import type { Meta } from "@storybook/react-vite";
import { base } from "../chains/chain-definitions/base.js";
import { ethereum } from "../chains/chain-definitions/ethereum.js";
import { defineChain } from "../chains/utils.js";
import {
  BuyWidget,
  type BuyWidgetProps,
} from "../react/web/ui/Bridge/BuyWidget.js";
import { storyClient } from "./utils.js";

const meta = {
  title: "Bridge/Buy/BuyWidget",
} satisfies Meta<typeof BuyWidget>;
export default meta;

export function Basic() {
  return <Variant client={storyClient} />;
}

export function PayAnotherWallet() {
  return (
    <Variant
      client={storyClient}
      amount="10"
      chain={base}
      tokenAddress="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
      receiverAddress="0x83Dd93fA5D8343094f850f90B3fb90088C1bB425"
    />
  );
}

export function BuyBaseNativeToken() {
  return <Variant client={storyClient} chain={base} amount="0.1" />;
}

export function JPYCurrency() {
  return (
    <Variant client={storyClient} chain={base} amount="0.1" currency="JPY" />
  );
}

export function NoThirdwebBranding() {
  return (
    <Variant
      client={storyClient}
      chain={base}
      amount="0.1"
      currency="JPY"
      showThirdwebBranding={false}
    />
  );
}

export function BuyBaseUSDC() {
  return (
    <Variant
      client={storyClient}
      chain={base}
      amount="0.1"
      tokenAddress="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
    />
  );
}

export function CustomTitleDescriptionAndButtonLabel() {
  return (
    <Variant
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
    <Variant
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
    <Variant client={storyClient} chain={defineChain(84532)} amount="0.1" />
  );
}

export function UnsupportedToken() {
  return (
    <Variant
      client={storyClient}
      chain={base}
      amount="0.1"
      tokenAddress="0xc3e13Ecf3B6C2Aa0F2Eb5e898De02d704352Aa54" // this is actually NFT
    />
  );
}

export function OnlyCardSupported() {
  return (
    <Variant
      client={storyClient}
      chain={base}
      amount="0.1"
      paymentMethods={["card"]}
    />
  );
}

export function OnlyCryptoSupported() {
  return (
    <Variant
      client={storyClient}
      chain={base}
      amount="0.1"
      paymentMethods={["crypto"]}
    />
  );
}

export function LargeAmount() {
  return (
    <Variant
      client={storyClient}
      chain={ethereum}
      tokenAddress="0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
      amount="150000"
    />
  );
}

function Variant(props: BuyWidgetProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        alignItems: "center",
      }}
    >
      <BuyWidget {...props} theme="dark" />
      <BuyWidget {...props} theme="light" />
    </div>
  );
}
