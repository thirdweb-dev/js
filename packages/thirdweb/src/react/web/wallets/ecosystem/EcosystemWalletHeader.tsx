"use client";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { EcosystemWalletId } from "../../../../wallets/wallet-types.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { ModalTitle } from "../../ui/components/modalElements.js";
import { useWalletInfo } from "../../ui/hooks/useWalletInfo.js";

/**
 * @internal
 */
export function EcosystemWalletHeader(props: {
  wallet: Wallet<EcosystemWalletId>;
  onBack?: () => void;
}) {
  const walletInfo = useWalletInfo(props.wallet.id);
  return (
    <ModalHeader
      onBack={props.onBack}
      title={
        <Container>
          <ModalTitle>{walletInfo.data?.name}</ModalTitle>
        </Container>
      }
    />
  );
}
