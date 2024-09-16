import { useProposalCreateMutation } from "@3rdweb-sdk/react/hooks/useVote";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { FiPlus } from "react-icons/fi";
import type { ThirdwebContract } from "thirdweb";
import { Button, Drawer } from "tw-components";
import { CreateProposalForm } from "./proposal-form";

interface VoteButtonProps {
  contract: ThirdwebContract;
}

const PROPOSAL_FORM_ID = "proposal-form-id";

export const ProposalButton: React.FC<VoteButtonProps> = ({ contract }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const propose = useProposalCreateMutation(contract);

  return (
    <>
      <Drawer
        size="md"
        isOpen={isOpen}
        onClose={onClose}
        header={{ children: <>Create new proposal</> }}
        footer={{
          children: (
            <>
              <Button
                isDisabled={propose.isPending}
                variant="outline"
                mr={3}
                onClick={onClose}
              >
                Cancel
              </Button>
              <TransactionButton
                transactionCount={1}
                isLoading={propose.isPending}
                form={PROPOSAL_FORM_ID}
                type="submit"
                colorScheme="primary"
              >
                Submit Proposal
              </TransactionButton>
            </>
          ),
        }}
      >
        <CreateProposalForm formId={PROPOSAL_FORM_ID} propose={propose} />
      </Drawer>
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
