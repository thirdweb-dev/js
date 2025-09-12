import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import type { BridgeChain } from "../../../bridge/types/Chain.js";
import { useActiveAccount } from "../../../react/core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../react/core/hooks/wallets/useActiveWallet.js";
import { useActiveWalletChain } from "../../../react/core/hooks/wallets/useActiveWalletChain.js";
import { SwapWidgetContainer } from "../../../react/web/ui/Bridge/swap-widget/SwapWidget.js";
import {
  type SelectSellToken,
  SelectSellTokenConnectedUI,
  SelectSellTokenDisconnectedUI,
} from "../../../react/web/ui/Bridge/swap-widget/select-sell-token.js";
import type { ActiveWalletInfo } from "../../../react/web/ui/Bridge/swap-widget/types.js";
import { ConnectButton } from "../../../react/web/ui/ConnectWallet/ConnectButton.js";
import { storyClient } from "../../utils.js";

const meta = {
  parameters: {
    layout: "centered",
  },
  title: "Bridge/Swap/screens/SelectSellTokenUI",
} satisfies Meta<typeof SelectSellToken>;
export default meta;

export function ChainLoading() {
  const [selectedChain, setSelectedChain] = useState<BridgeChain | undefined>(
    undefined,
  );

  const activeChain = useActiveWalletChain();
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();

  const activeWalletInfo: ActiveWalletInfo | undefined =
    activeAccount && activeWallet && activeChain
      ? {
          activeChain,
          activeWallet,
          activeAccount,
        }
      : undefined;

  if (!activeWalletInfo) {
    return (
      <div>
        <p> connect wallet to view story </p>
        <ConnectButton client={storyClient} />
      </div>
    );
  }

  return (
    <SwapWidgetContainer theme="dark" className="w-full">
      <SelectSellTokenConnectedUI
        client={storyClient}
        setSelectedChain={setSelectedChain}
        onBack={() => {}}
        selectedChain={selectedChain}
        tokens={[]}
        isPending={true}
        selectedToken={undefined}
        setSelectedToken={() => {}}
        search={""}
        showAll={() => {}}
        setSearch={() => {}}
        activeWalletInfo={activeWalletInfo}
      />
    </SwapWidgetContainer>
  );
}

export function Disconnected() {
  return (
    <SwapWidgetContainer theme="dark" className="w-full">
      <SelectSellTokenDisconnectedUI client={storyClient} onBack={() => {}} />
    </SwapWidgetContainer>
  );
}
