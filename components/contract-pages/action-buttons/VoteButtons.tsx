import {
  useDelegateMutation,
  useTokensDelegated,
} from "@3rdweb-sdk/react/hooks/useVote";
import { Icon, Tooltip, useDisclosure } from "@chakra-ui/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import { MintDrawer } from "components/shared/MintDrawer";
import { useTxNotifications } from "hooks/useTxNotifications";
import { FiPlus } from "react-icons/fi";
import { Button } from "tw-components";

interface IVoteButton {
  contract?: ValidContractInstance;
}

export const ProposalButton: React.FC<IVoteButton> = ({ contract }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <MintDrawer isOpen={isOpen} onClose={onClose} contract={contract} />
      <Button
        colorScheme="primary"
        onClick={onOpen}
        leftIcon={<Icon as={FiPlus} />}
      >
        Create Proposal
      </Button>
    </>
  );
};

export const DelegateButton: React.FC<IVoteButton> = ({ contract }) => {
  const { data: delegated, isLoading } = useTokensDelegated(
    contract?.getAddress(),
  );
  const { mutate: delegate, isLoading: isDelegating } = useDelegateMutation(
    contract?.getAddress(),
  );

  const { onSuccess, onError } = useTxNotifications(
    "Tokens succesfully delegated",
    "Error delegating tokens",
  );

  if (delegated || isLoading) {
    return null;
  }

  const delegateTokens = () => {
    delegate(undefined, {
      onSuccess,
      onError,
    });
  };

  return (
    <Tooltip label="You need to delegate tokens to this contract before you can make proposals and vote.">
      <Button
        colorScheme="primary"
        onClick={delegateTokens}
        isLoading={isDelegating}
      >
        Delegate Tokens
      </Button>
    </Tooltip>
  );
};
