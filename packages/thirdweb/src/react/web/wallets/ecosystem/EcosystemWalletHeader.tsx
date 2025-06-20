"use client";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { EcosystemWalletId } from "../../../../wallets/wallet-types.js";
import { iconSize, radius } from "../../../core/design-system/index.js";
import { useWalletInfo } from "../../../core/utils/wallet.js";
import { ModalHeader } from "../../ui/components/basic.js";
import { Img } from "../../ui/components/Img.js";
import { ModalTitle } from "../../ui/components/modalElements.js";
import { Skeleton } from "../../ui/components/Skeleton.js";

/**
 * @internal
 */
export function EcosystemWalletHeader(props: {
  wallet: Wallet<EcosystemWalletId>;
  client: ThirdwebClient;
  onBack?: () => void;
}) {
  const walletInfo = useWalletInfo(props.wallet.id);

  return (
    <ModalHeader
      leftAligned
      onBack={props.onBack}
      title={
        walletInfo.isLoading ? (
          <Skeleton height="24px" width="200px" />
        ) : (
          <>
            {!walletInfo.data?.image_id ? null : (
              <Img
                client={props.client}
                height={iconSize.md}
                src={walletInfo.data?.image_id}
                style={{
                  borderRadius: radius.sm,
                }}
                width={iconSize.md}
              />
            )}
            <ModalTitle>{walletInfo.data?.name}</ModalTitle>
          </>
        )
      }
    />
  );
}
