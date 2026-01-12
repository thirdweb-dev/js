import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { SwapWidgetContainer } from "../../../react/web/ui/Bridge/swap-widget/SwapWidget.js";
import {
  SelectBridgeChain,
  SelectBridgeChainUI,
} from "../../../react/web/ui/Bridge/swap-widget/select-chain.js";
import type { SelectedTab } from "../../../react/web/ui/Bridge/swap-widget/types.js";
import { storyClient } from "../../utils.js";

const meta = {
  parameters: {
    layout: "centered",
  },
  title: "Bridge/Swap/screens/SelectChain",
} satisfies Meta<typeof SelectBridgeChain>;
export default meta;

export function WithDataDesktop() {
  const [selectedTab, setSelectedTab] = useState<SelectedTab>({
    type: "your-tokens",
  });
  return (
    <SwapWidgetContainer theme="dark" className="w-full">
      <SelectBridgeChain
        type="buy"
        selections={{
          buyChainId: undefined,
          sellChainId: undefined,
        }}
        isMobile={false}
        client={storyClient}
        onSelectTab={setSelectedTab}
        onBack={() => {}}
        selectedTab={selectedTab}
      />
    </SwapWidgetContainer>
  );
}

export function LoadingDesktop() {
  const [selectedTab, setSelectedTab] = useState<SelectedTab>({
    type: "your-tokens",
  });
  return (
    <SwapWidgetContainer theme="dark" className="w-full">
      <SelectBridgeChainUI
        type="buy"
        selections={{
          buyChainId: undefined,
          sellChainId: undefined,
        }}
        isMobile={false}
        client={storyClient}
        onSelectTab={setSelectedTab}
        onBack={() => {}}
        isPending={true}
        chains={[]}
        selectedTab={selectedTab}
      />
    </SwapWidgetContainer>
  );
}

export function WithDataMobile() {
  const [selectedTab, setSelectedTab] = useState<SelectedTab>({
    type: "your-tokens",
  });
  return (
    <SwapWidgetContainer theme="dark" className="w-full">
      <SelectBridgeChain
        type="buy"
        selections={{
          buyChainId: undefined,
          sellChainId: undefined,
        }}
        isMobile={true}
        client={storyClient}
        onSelectTab={setSelectedTab}
        onBack={() => {}}
        selectedTab={selectedTab}
      />
    </SwapWidgetContainer>
  );
}

export function LoadingMobile() {
  const [selectedTab, setSelectedTab] = useState<SelectedTab>({
    type: "your-tokens",
  });
  return (
    <SwapWidgetContainer theme="dark" className="w-full">
      <SelectBridgeChainUI
        type="buy"
        selections={{
          buyChainId: undefined,
          sellChainId: undefined,
        }}
        isMobile={true}
        client={storyClient}
        onSelectTab={setSelectedTab}
        onBack={() => {}}
        isPending={true}
        chains={[]}
        selectedTab={selectedTab}
      />
    </SwapWidgetContainer>
  );
}
