"use client";

import { ExternalLinkIcon } from "@radix-ui/react-icons";
import type { ThirdwebClient } from "../../../../client/client.js";
import { formatExplorerAddressUrl } from "../../../../utils/url.js";
import { iconSize } from "../../../core/design-system/index.js";
import { useChainExplorers } from "../../../core/hooks/others/useChainQuery.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../core/hooks/wallets/useActiveWallet.js";
import { useActiveWalletChain } from "../../../core/hooks/wallets/useActiveWalletChain.js";
import { LoadingScreen } from "../../wallets/shared/LoadingScreen.js";
import { Container, Line, ModalHeader } from "../components/basic.js";
import { ButtonLink } from "../components/buttons.js";
import { Spacer } from "../components/Spacer.js";
import type { ConnectLocale } from "./locale/types.js";
import type { PayerInfo } from "./screens/Buy/types.js";
import type { WalletDetailsModalScreen } from "./screens/types.js";
import { WalletTransactionHistory } from "./screens/WalletTransactionHistory.js";

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
  const activeChain = useActiveWalletChain();
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  const chainExplorers = useChainExplorers(activeChain);

  const payer: PayerInfo | undefined =
    activeChain && activeAccount && activeWallet
      ? { account: activeAccount, chain: activeChain, wallet: activeWallet }
      : undefined;

  if (!payer) {
    return <LoadingScreen />;
  }

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title={props.locale.transactions} />
      </Container>
      <Line />
      <Container
        px="lg"
        scrollY
        style={{
          minHeight: "330px",
        }}
      >
        <Spacer y="md" />
        <WalletTransactionHistory
          address={payer.account.address}
          client={props.client}
          locale={props.locale}
        />
      </Container>
      <Line />
      <Container p="lg">
        <ButtonLink
          as="a"
          fullWidth
          gap="xs"
          href={formatExplorerAddressUrl(
            chainExplorers.explorers[0]?.url ?? "",
            activeAccount?.address ?? "",
          )}
          style={{
            color: "inherit",
            textDecoration: "none",
          }}
          target="_blank"
          variant="outline"
        >
          View on Explorer
          <ExternalLinkIcon height={iconSize.sm} width={iconSize.sm} />
        </ButtonLink>
      </Container>
    </Container>
  );
}
