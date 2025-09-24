import type { Meta } from "@storybook/react";
import { BridgeWidgetScript } from "../../../script-exports/bridge-widget-script.js";
import { storyClient } from "../../utils.js";

const meta: Meta<typeof BridgeWidgetScript> = {
  title: "Bridge/BridgeWidgetScript",
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => {
      return (
        <div>
          <Story />
        </div>
      );
    },
  ],
};
export default meta;

export function BasicUsage() {
  return (
    <BridgeWidgetScript
      clientId={storyClient.clientId}
      buy={{ chainId: 8453, amount: "0.1" }}
    />
  );
}

export function LightTheme() {
  return (
    <BridgeWidgetScript
      clientId={storyClient.clientId}
      theme="light"
      buy={{ chainId: 8453, amount: "0.1" }}
    />
  );
}

export function CurrencySet() {
  return (
    <BridgeWidgetScript
      clientId={storyClient.clientId}
      currency="JPY"
      buy={{ chainId: 8453, amount: "0.1" }}
    />
  );
}

export function NoThirdwebBranding() {
  return (
    <BridgeWidgetScript
      clientId={storyClient.clientId}
      theme="light"
      buy={{ chainId: 8453, amount: "0.1" }}
      showThirdwebBranding={false}
    />
  );
}

export function CustomTheme() {
  return (
    <BridgeWidgetScript
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
