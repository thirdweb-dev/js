import { ToolTipLabel } from "@/components/ui/tooltip";
import { thirdwebClient } from "@/constants/client";
import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { Box } from "@chakra-ui/react";
import {
  type DropContract,
  useResetClaimConditions,
} from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useV5DashboardChain } from "lib/v5-adapter";
import { CircleHelpIcon } from "lucide-react";
import { getContract } from "thirdweb";

interface ResetClaimEligibilityProps {
  isErc20: boolean;
  contract: DropContract;
  tokenId?: string;
  isColumn?: true;
}

export const ResetClaimEligibility: React.FC<ResetClaimEligibilityProps> = ({
  contract,
  tokenId,
  isErc20,
}) => {
  const trackEvent = useTrack();
  const resetClaimConditions = useResetClaimConditions(contract, tokenId);
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

    resetClaimConditions.mutate(undefined, {
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

  const chain = useV5DashboardChain(contract?.chainId);

  if (!contract || !chain) {
    return null;
  }

  const contractV5 = getContract({
    address: contract.getAddress(),
    chain,
    client: thirdwebClient,
  });

  return (
    <AdminOnly contract={contractV5} fallback={<Box pb={5} />}>
      <TransactionButton
        colorScheme="secondary"
        bg="bgBlack"
        color="bgWhite"
        transactionCount={1}
        type="button"
        isLoading={resetClaimConditions.isLoading}
        onClick={handleResetClaimEligibility}
        loadingText="Resetting..."
        size="sm"
      >
        Reset Eligibility{" "}
        <ToolTipLabel
          label={
            <>
              This {`contract's`} claim eligibility stores who has already
              claimed {isErc20 ? "tokens" : "NFTs"} from this contract and
              carries across claim phases. Resetting claim eligibility will
              reset this state permanently, and wallets that have already
              claimed to their limit will be able to claim again.
            </>
          }
        >
          <CircleHelpIcon className="size-4 text-muted-foreground ml-2" />
        </ToolTipLabel>
      </TransactionButton>
    </AdminOnly>
  );
};
