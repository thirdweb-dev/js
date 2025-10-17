import type { Meta } from "@storybook/react";
import { lightTheme } from "../../../react/core/design-system/index.js";
import {
  SwapWidget,
  type SwapWidgetProps,
} from "../../../react/web/ui/Bridge/swap-widget/SwapWidget.js";
import { storyClient } from "../../utils.js";

const meta: Meta<typeof SwapWidget> = {
  title: "Bridge/Swap/SwapWidget",
};
export default meta;

export function BasicUsage() {
  return <SwapWidget client={storyClient} persistTokenSelections={false} />;
}

export function CurrencySet() {
  return (
    <Variant
      client={storyClient}
      currency="JPY"
      persistTokenSelections={false}
    />
  );
}

export function LightMode() {
  return (
    <Variant
      client={storyClient}
      currency="JPY"
      theme="light"
      persistTokenSelections={false}
    />
  );
}

export function NoThirdwebBranding() {
  return (
    <Variant
      client={storyClient}
      currency="JPY"
      showThirdwebBranding={false}
      persistTokenSelections={false}
    />
  );
}

export function CustomTheme() {
  return (
    <Variant
      client={storyClient}
      currency="JPY"
      persistTokenSelections={false}
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
  );
}

function Variant(props: SwapWidgetProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        alignItems: "center",
      }}
    >
      <SwapWidget {...props} theme="dark" />
      <SwapWidget {...props} theme="light" />
    </div>
  );
}
