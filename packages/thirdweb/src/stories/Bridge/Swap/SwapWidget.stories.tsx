import type { Meta } from "@storybook/react-vite";
import { lightTheme } from "../../../react/core/design-system/index.js";
import { SwapWidget } from "../../../react/web/ui/Bridge/swap-widget/SwapWidget.js";
import { storyClient } from "../../utils.js";

const meta = {
  parameters: {
    layout: "centered",
  },
  title: "Bridge/Swap/SwapWidget",
} satisfies Meta<typeof SwapWidget>;
export default meta;

export function BasicUsage() {
  return <SwapWidget client={storyClient} />;
}

export function CurrencySet() {
  return <SwapWidget client={storyClient} currency="JPY" />;
}

export function LightMode() {
  return <SwapWidget client={storyClient} currency="JPY" theme="light" />;
}

export function NoThirdwebBranding() {
  return (
    <SwapWidget
      client={storyClient}
      currency="JPY"
      showThirdwebBranding={false}
    />
  );
}

export function CustomTheme() {
  return (
    <SwapWidget
      client={storyClient}
      currency="JPY"
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
