import { CreateProposalForm } from "./proposal-form";
import { useProposalCreateMutation } from "@3rdweb-sdk/react/hooks/useVote";
import { Icon, useDisclosure } from "@chakra-ui/react";
import type { Vote } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { FiPlus } from "react-icons/fi";
import { Button, Drawer } from "tw-components";

interface VoteButtonProps {
  contract?: Vote;
}

const PROPOSAL_FORM_ID = "proposal-form-id";

export const ProposalButton: React.FC<VoteButtonProps> = ({ contract }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const propose = useProposalCreateMutation(contract?.getAddress());

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
                isDisabled={propose.isLoading}
                variant="outline"
                mr={3}
                onClick={onClose}
              >
                Cancel
              </Button>
              <TransactionButton
                transactionCount={1}
                isLoading={propose.isLoading}
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
