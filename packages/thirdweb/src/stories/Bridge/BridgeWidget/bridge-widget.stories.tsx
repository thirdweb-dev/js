import type { Meta } from "@storybook/react";
import { lightTheme } from "../../../react/core/design-system/index.js";
import {
  BridgeWidget,
  type BridgeWidgetProps,
} from "../../../react/web/ui/Bridge/bridge-widget/bridge-widget.js";
import { createWallet } from "../../../wallets/create-wallet.js";
import { storyClient } from "../../utils.js";

const meta: Meta<typeof BridgeWidget> = {
  title: "Bridge/BridgeWidget",
};
export default meta;

export function BasicUsage() {
  return (
    <Variant client={storyClient} buy={{ chainId: 8453, amount: "0.1" }} />
  );
}

export function CurrencySet() {
  return (
    <Variant
      client={storyClient}
      currency="JPY"
      buy={{ chainId: 8453, amount: "0.1" }}
    />
  );
}

export function NoThirdwebBranding() {
  return (
    <Variant
      client={storyClient}
      theme="light"
      buy={{ chainId: 8453, amount: "0.1" }}
      showThirdwebBranding={false}
    />
  );
}

export function CustomTheme() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        alignItems: "center",
      }}
    >
      <BridgeWidget
        client={storyClient}
        currency="JPY"
        buy={{ chainId: 8453, amount: "0.1" }}
        showThirdwebBranding={false}
        theme={lightTheme({
          colors: {
            modalBg: "#FFFFF0",
            tertiaryBg: "#DBE4C9",
            borderColor: "#8AA624",
            secondaryText: "#3E3F29",
            accentText: "#E43636",
          },
        })}
      />
    </div>
  );
}

export function CustomWallets() {
  return (
    <Variant
      client={storyClient}
      currency="JPY"
      buy={{ chainId: 8453, amount: "0.1" }}
      connectOptions={{
        wallets: [createWallet("io.metamask"), createWallet("me.rainbow")],
      }}
    />
  );
}

function Variant(props: BridgeWidgetProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        alignItems: "center",
      }}
    >
      <BridgeWidget {...props} theme="dark" />
      <BridgeWidget {...props} theme="light" />
    </div>
  );
}
