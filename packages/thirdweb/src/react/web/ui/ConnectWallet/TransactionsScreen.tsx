"use client";

import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import type { ThirdwebClient } from "../../../../client/client.js";
import { iconSize } from "../../../core/design-system/index.js";
import { useChainExplorers } from "../../../core/hooks/others/useChainQuery.js";
import { useActiveAccount } from "../../hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../hooks/wallets/useActiveWallet.js";
import { useActiveWalletChain } from "../../hooks/wallets/useActiveWalletChain.js";
import { LoadingScreen } from "../../wallets/shared/LoadingScreen.js";
import Tabs from "../components/Tabs.js";
import { Container, Line, ModalHeader } from "../components/basic.js";
import { ButtonLink } from "../components/buttons.js";
import type { ConnectLocale } from "./locale/types.js";
import { PayTxHistoryList } from "./screens/Buy/pay-transactions/BuyTxHistory.js";
import { TxDetailsScreen } from "./screens/Buy/pay-transactions/TxDetailsScreen.js";
import type { TxStatusInfo } from "./screens/Buy/pay-transactions/useBuyTransactionsToShow.js";
import type { PayerInfo } from "./screens/Buy/types.js";
import { WalletTransactionHistory } from "./screens/WalletTransactionHistory.js";
import type { WalletDetailsModalScreen } from "./screens/types.js";

//

/**
 * @internal
 */
export function TransactionsScreen(props: {
  title: string;
  onBack: () => void;
  setScreen: (screen: WalletDetailsModalScreen) => void;
  closeModal: () => void;
  locale: ConnectLocale;
  client: ThirdwebClient;
}) {
  const [activeTab, setActiveTab] = useState("Purchases");
  // For now, you can only select pay transactions (purcahses)
  const [selectedTx, setSelectedTx] = useState<TxStatusInfo | null>(null);

  const activeChain = useActiveWalletChain();
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  const chainExplorers = useChainExplorers(activeChain);

  const payer: PayerInfo | undefined =
    activeChain && activeAccount && activeWallet
      ? { chain: activeChain, account: activeAccount, wallet: activeWallet }
      : undefined;

  if (!payer) {
    return <LoadingScreen />;
  }

  if (selectedTx) {
    return (
      <TxDetailsScreen
        title={props.title}
        client={props.client}
        statusInfo={selectedTx}
        onBack={() => setSelectedTx(null)}
        onDone={() => setSelectedTx(null)}
        payer={payer}
        isBuyForTx={false}
        isEmbed={false}
      />
    );
  }

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title={props.locale.transactions} onBack={props.onBack} />
      </Container>
      <Line />
      <Container
        px="sm"
        scrollY
        style={{
          minHeight: "330px",
        }}
      >
        <Container style={{ position: "relative", height: "250px" }}>
          <Tabs
            options={["Purchases", "Transactions"]}
            selected={activeTab}
            onSelect={setActiveTab}
          >
            {activeTab === "Purchases" && (
              <PayTxHistoryList
                client={props.client}
                onSelectTx={setSelectedTx}
              />
            )}
            {activeTab === "Transactions" && (
              <WalletTransactionHistory
                locale={props.locale}
                client={props.client}
                address={payer.account.address}
              />
            )}
          </Tabs>
        </Container>
      </Container>
      <Line />
      <Container p="lg">
        <ButtonLink
          fullWidth
          variant="outline"
          href={`${chainExplorers.explorers[0]?.url}/address/${activeAccount?.address}`}
          target="_blank"
          as="a"
          gap="xs"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          View on Explorer{" "}
          <ExternalLinkIcon width={iconSize.sm} height={iconSize.sm} />
        </ButtonLink>
      </Container>
    </Container>
  );
}
