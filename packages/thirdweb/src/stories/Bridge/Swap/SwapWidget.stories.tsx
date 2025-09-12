import type { Meta } from "@storybook/react-vite";
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
