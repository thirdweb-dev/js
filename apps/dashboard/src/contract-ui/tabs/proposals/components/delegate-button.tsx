import {
  useDelegateMutation,
  useTokensDelegated,
} from "@3rdweb-sdk/react/hooks/useVote";
import { Tooltip } from "@chakra-ui/react";
import type { Vote } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";

interface VoteButtonProps {
  contract?: Vote;
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
    <Tooltip label="You need to delegate tokens to this contract before you can make proposals and vote.">
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
    </Tooltip>
  );
};
