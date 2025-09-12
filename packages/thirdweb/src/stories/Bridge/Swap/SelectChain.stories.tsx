import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import type { BridgeChain } from "../../../bridge/types/Chain.js";
import { SwapWidgetContainer } from "../../../react/web/ui/Bridge/swap-widget/SwapWidget.js";
import {
  SelectBridgeChain,
  SelectBridgeChainUI,
} from "../../../react/web/ui/Bridge/swap-widget/select-chain.js";
import { storyClient } from "../../utils.js";

const meta = {
  parameters: {
    layout: "centered",
  },
  title: "Bridge/Swap/screens/SelectChain",
} satisfies Meta<typeof SelectBridgeChain>;
export default meta;

export function WithData() {
  const [selectedChain, setSelectedChain] = useState<BridgeChain | undefined>(
    undefined,
  );
  return (
    <SwapWidgetContainer theme="dark" className="w-full">
      <SelectBridgeChain
        client={storyClient}
        onSelectChain={setSelectedChain}
        onBack={() => {}}
        selectedChain={selectedChain}
      />
    </SwapWidgetContainer>
  );
}

export function Loading() {
  const [selectedChain, setSelectedChain] = useState<BridgeChain | undefined>(
    undefined,
  );
  return (
    <SwapWidgetContainer theme="dark" className="w-full">
      <SelectBridgeChainUI
        client={storyClient}
        onSelectChain={setSelectedChain}
        onBack={() => {}}
        isPending={true}
        chains={[]}
        selectedChain={selectedChain}
      />
    </SwapWidgetContainer>
  );
}
