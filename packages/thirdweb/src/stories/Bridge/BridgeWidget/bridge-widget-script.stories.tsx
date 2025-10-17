import type { Meta } from "@storybook/react";
import {
  BridgeWidgetScript,
  type BridgeWidgetScriptProps,
} from "../../../script-exports/bridge-widget-script.js";
import { storyClient } from "../../utils.js";

const meta: Meta<typeof BridgeWidgetScript> = {
  title: "Bridge/BridgeWidgetScript",
};
export default meta;

export function BasicUsage() {
  return (
    <Variant
      clientId={storyClient.clientId}
      buy={{ chainId: 8453, amount: "0.1" }}
    />
  );
}

export function LightTheme() {
  return (
    <Variant
      clientId={storyClient.clientId}
      theme="light"
      buy={{ chainId: 8453, amount: "0.1" }}
    />
  );
}

export function CurrencySet() {
  return (
    <Variant
      clientId={storyClient.clientId}
      currency="JPY"
      buy={{ chainId: 8453, amount: "0.1" }}
    />
  );
}

export function NoThirdwebBranding() {
  return (
    <Variant
      clientId={storyClient.clientId}
      theme="light"
      buy={{ chainId: 8453, amount: "0.1" }}
      showThirdwebBranding={false}
    />
  );
}

export function CustomTheme() {
  return (
    <Variant
      clientId={storyClient.clientId}
      buy={{ chainId: 8453, amount: "0.1" }}
      theme={{
        type: "light",
        colors: {
          modalBg: "#FFFFF0",
          tertiaryBg: "#DBE4C9",
          borderColor: "#8AA624",
          secondaryText: "#3E3F29",
          accentText: "#E43636",
        },
      }}
    />
  );
}

function Variant(props: BridgeWidgetScriptProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        alignItems: "center",
      }}
    >
      <BridgeWidgetScript {...props} theme="dark" />
      <BridgeWidgetScript {...props} theme="light" />
    </div>
  );
}
