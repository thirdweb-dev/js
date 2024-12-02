"use client";

import { ToolTipLabel } from "@/components/ui/tooltip";
import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { CircleHelpIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import * as ERC20Ext from "thirdweb/extensions/erc20";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import { useSendAndConfirmTransaction } from "thirdweb/react";

interface ResetClaimEligibilityProps {
  isErc20: boolean;
  contract: ThirdwebContract;
  tokenId?: string;
}

export const ResetClaimEligibility: React.FC<ResetClaimEligibilityProps> = ({
  contract,
  tokenId,
  isErc20,
}) => {
  const trackEvent = useTrack();

  const sendTxMutation = useSendAndConfirmTransaction();

  const txNotification = useTxNotifications(
    "Successfully reset claim eligibility",
    "Failed to reset claim eligibility",
  );

  const handleResetClaimEligibility = () => {
    const category = isErc20 ? "token" : "nft";

    trackEvent({
      category,
      action: "reset-claim-conditions",
      label: "attempt",
    });

    const tx = (() => {
      switch (true) {
        // erc 20
        case isErc20: {
          return ERC20Ext.resetClaimEligibility({ contract });
        }
        // erc 1155
        case tokenId !== undefined: {
          return ERC1155Ext.resetClaimEligibility({
            contract,
            tokenId: BigInt(tokenId),
          });
        }
        // assume erc 721
        default: {
          return ERC721Ext.resetClaimEligibility({ contract });
        }
      }
    })();

    sendTxMutation.mutate(tx, {
      onSuccess: () => {
        txNotification.onSuccess();
        trackEvent({
          category,
          action: "reset-claim-conditions",
          label: "success",
        });
      },
      onError: (error) => {
        txNotification.onError(error);
        trackEvent({
          category,
          action: "reset-claim-conditions",
          label: "error",
          error,
        });
      },
    });
  };

  if (!contract) {
    return null;
  }

  return (
    <AdminOnly contract={contract} fallback={<div className="pb-5" />}>
      <TransactionButton
        transactionCount={1}
        type="button"
        isPending={sendTxMutation.isPending}
        onClick={handleResetClaimEligibility}
        size="sm"
        txChainID={contract.chain.id}
      >
        {sendTxMutation.isPending ? (
          "Resetting Eligibility"
        ) : (
          <div className="flex items-center gap-2">
            Reset Eligibility
            <ToolTipLabel
              label={
                <span className="text-left">
                  This {`contract's`} claim eligibility stores who has already
                  claimed {isErc20 ? "tokens" : "NFTs"} from this contract and
                  carries across claim phases. Resetting claim eligibility will
                  reset this state permanently, and wallets that have already
                  claimed to their limit will be able to claim again.
                </span>
              }
            >
              <CircleHelpIcon className="size-4" />
            </ToolTipLabel>
          </div>
        )}
      </TransactionButton>
    </AdminOnly>
  );
};
