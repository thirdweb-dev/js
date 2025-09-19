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

export function WithDataDesktop() {
  const [selectedChain, setSelectedChain] = useState<BridgeChain | undefined>(
    undefined,
  );
  return (
    <SwapWidgetContainer theme="dark" className="w-full">
      <SelectBridgeChain
        isMobile={false}
        client={storyClient}
        onSelectChain={setSelectedChain}
        onBack={() => {}}
        selectedChain={selectedChain}
      />
    </SwapWidgetContainer>
  );
}

export function LoadingDesktop() {
  const [selectedChain, setSelectedChain] = useState<BridgeChain | undefined>(
    undefined,
  );
  return (
    <SwapWidgetContainer theme="dark" className="w-full">
      <SelectBridgeChainUI
        isMobile={false}
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

export function WithDataMobile() {
  const [selectedChain, setSelectedChain] = useState<BridgeChain | undefined>(
    undefined,
  );
  return (
    <SwapWidgetContainer theme="dark" className="w-full">
      <SelectBridgeChain
        isMobile={true}
        client={storyClient}
        onSelectChain={setSelectedChain}
        onBack={() => {}}
        selectedChain={selectedChain}
      />
    </SwapWidgetContainer>
  );
}

export function LoadingMobile() {
  const [selectedChain, setSelectedChain] = useState<BridgeChain | undefined>(
    undefined,
  );
  return (
    <SwapWidgetContainer theme="dark" className="w-full">
      <SelectBridgeChainUI
        isMobile={true}
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
