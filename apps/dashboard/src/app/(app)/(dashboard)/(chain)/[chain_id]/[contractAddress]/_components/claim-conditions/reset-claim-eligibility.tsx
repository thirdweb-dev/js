"use client";

import { CircleHelpIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import * as ERC20Ext from "thirdweb/extensions/erc20";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { AdminOnly } from "@/components/contracts/roles/admin-only";
import { TransactionButton } from "@/components/tx-button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useTxNotifications } from "@/hooks/useTxNotifications";

interface ResetClaimEligibilityProps {
  isErc20: boolean;
  contract: ThirdwebContract;
  tokenId?: string;
  isLoggedIn: boolean;
  isMultiphase: boolean;
}

export const ResetClaimEligibility: React.FC<ResetClaimEligibilityProps> = ({
  contract,
  tokenId,
  isErc20,
  isLoggedIn,
  isMultiphase,
}) => {
  const sendTxMutation = useSendAndConfirmTransaction();

  const txNotification = useTxNotifications(
    "Successfully reset claim eligibility",
    "Failed to reset claim eligibility",
  );

  const handleResetClaimEligibility = () => {
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
            singlePhaseDrop: !isMultiphase,
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
      onError: (error) => {
        txNotification.onError(error);
      },
      onSuccess: () => {
        txNotification.onSuccess();
      },
    });
  };

  if (!contract) {
    return null;
  }

  return (
    <AdminOnly contract={contract} fallback={<div className="pb-5" />}>
      <TransactionButton
        client={contract.client}
        isLoggedIn={isLoggedIn}
        isPending={sendTxMutation.isPending}
        onClick={handleResetClaimEligibility}
        size="sm"
        transactionCount={1}
        txChainID={contract.chain.id}
        type="button"
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
