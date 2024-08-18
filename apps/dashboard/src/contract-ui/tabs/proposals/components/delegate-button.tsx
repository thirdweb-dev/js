import { ToolTipLabel } from "@/components/ui/tooltip";
import {
  useDelegateMutation,
  useTokensDelegated,
} from "@3rdweb-sdk/react/hooks/useVote";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import type { ThirdwebContract } from "thirdweb";

interface VoteButtonProps {
  contract: ThirdwebContract;
}

export const DelegateButton: React.FC<VoteButtonProps> = ({ contract }) => {
  const trackEvent = useTrack();
  const { data: delegated, isLoading } = useTokensDelegated(contract);
  const { mutate: delegate, isLoading: isDelegating } =
    useDelegateMutation(contract);

  const { onSuccess, onError } = useTxNotifications(
    "Tokens successfully delegated",
    "Error delegating tokens",
  );

  if (delegated || isLoading) {
    return null;
  }

  return (
    <ToolTipLabel label="You need to delegate tokens to this contract before you can make proposals and vote.">
      <TransactionButton
        transactionCount={1}
        onClick={() =>
          delegate(undefined, {
            onSuccess: () => {
              onSuccess();
              trackEvent({
                category: "vote",
                action: "delegate",
                label: "success",
              });
            },
            onError: (error) => {
              trackEvent({
                category: "vote",
                action: "delegate",
                label: "error",
                error,
              });
              onError(error);
            },
          })
        }
        isLoading={isDelegating}
      >
        Delegate Tokens
      </TransactionButton>
    </ToolTipLabel>
  );
};
