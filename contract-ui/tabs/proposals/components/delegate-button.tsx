import {
  useDelegateMutation,
  useTokensDelegated,
} from "@3rdweb-sdk/react/hooks/useVote";
import { Tooltip } from "@chakra-ui/react";
import { VoteImpl } from "@thirdweb-dev/sdk/dist/declarations/src/contracts/prebuilt-implementations/vote";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTxNotifications } from "hooks/useTxNotifications";

interface VoteButtonProps {
  contract?: VoteImpl;
}

export const DelegateButton: React.FC<VoteButtonProps> = ({ contract }) => {
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
            onSuccess,
            onError,
          })
        }
        isLoading={isDelegating}
      >
        Delegate Tokens
      </TransactionButton>
    </Tooltip>
  );
};
