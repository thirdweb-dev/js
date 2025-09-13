import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import type { BridgeChain } from "../../../bridge/types/Chain.js";
import { SwapWidgetContainer } from "../../../react/web/ui/Bridge/swap-widget/SwapWidget.js";
import {
  SelectBuyToken,
  SelectBuyTokenUI,
} from "../../../react/web/ui/Bridge/swap-widget/select-buy-token.js";
import { storyClient } from "../../utils.js";

const meta = {
  parameters: {
    layout: "centered",
  },
  title: "Bridge/Swap/screens/SelectBuyTokenUI",
} satisfies Meta<typeof SelectBuyTokenUI>;
export default meta;

export function ChainLoading() {
  const [selectedChain, setSelectedChain] = useState<BridgeChain | undefined>(
    undefined,
  );
  return (
    <SwapWidgetContainer theme="dark" className="w-full">
      <SelectBuyTokenUI
        client={storyClient}
        setSelectedChain={setSelectedChain}
        onBack={() => {}}
        selectedChain={selectedChain}
        tokens={[]}
        isPending={true}
        selectedToken={undefined}
        setSelectedToken={() => {}}
        search={""}
        showMore={() => {}}
        setSearch={() => {}}
      />
    </SwapWidgetContainer>
  );
}

export function WithData() {
  return (
    <SwapWidgetContainer theme="dark" className="w-full">
      <SelectBuyToken
        client={storyClient}
        onBack={() => {}}
        selectedToken={undefined}
        setSelectedToken={() => {}}
      />
    </SwapWidgetContainer>
  );
}
