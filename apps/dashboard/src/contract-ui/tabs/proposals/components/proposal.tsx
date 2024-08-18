import {
  useCanExecuteProposal,
  useCastVoteMutation,
  useExecuteProposalMutation,
  useHasVotedOnProposal,
  useTokensDelegated,
  useVotingTokenDecimals,
} from "@3rdweb-sdk/react/hooks/useVote";
import { Flex, Icon } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useCallback } from "react";
import { FiCheck, FiMinus, FiX } from "react-icons/fi";
import { type ThirdwebContract, toTokens } from "thirdweb";
import {
  type ProposalItem,
  ProposalState,
  type VoteType,
} from "thirdweb/extensions/vote";
import { Button, Card, Text } from "tw-components";

const ProposalStateToMetadataMap: Record<keyof typeof ProposalState, string> = {
  pending: "gray.500",
  active: "primary.500",
  canceled: "red.500",
  defeated: "red.500",
  succeeded: "green.500",
  queued: "yellow.500",
  expired: "gray.500",
  executed: "green.500",
};

interface IProposal {
  proposal: ProposalItem;
  contract: ThirdwebContract;
}

export const Proposal: React.FC<IProposal> = ({ proposal, contract }) => {
  const { data: hasVoted, isLoading: hasVotedLoading } = useHasVotedOnProposal(
    contract,
    proposal.proposalId,
  );
  const { data: canExecute } = useCanExecuteProposal(
    contract,
    proposal.proposalId,
  );
  const { data: delegated } = useTokensDelegated(contract);
  const { mutate: execute, isLoading: isExecuting } =
    useExecuteProposalMutation(contract, proposal.proposalId);
  const {
    mutate: vote,
    isLoading: isVoting,
    variables,
  } = useCastVoteMutation(contract, proposal.proposalId);

  const { onSuccess: castVoteSuccess, onError: castVoteError } =
    useTxNotifications("Vote cast successfully", "Error casting vote");

  const castVote = useCallback(
    (voteType: VoteType) => {
      vote(
        { voteType },
        {
          onSuccess: castVoteSuccess,
          onError: castVoteError,
        },
      );
    },
    [castVoteError, castVoteSuccess, vote],
  );

  const { onSuccess: executeSuccess, onError: executeError } =
    useTxNotifications(
      "Proposal executed successfully",
      "Error executing proposal",
    );

  const executeProposal = useCallback(() => {
    execute(undefined, {
      onSuccess: executeSuccess,
      onError: executeError,
    });
  }, [execute, executeError, executeSuccess]);

  const decimalQuery = useVotingTokenDecimals(contract);

  return (
    <Card key={proposal.proposalId.toString()}>
      <Flex mb="8px">
        <Flex
          paddingY="0px"
          paddingX="16px"
          borderRadius="25px"
          bg={
            ProposalStateToMetadataMap[
              proposal.stateLabel as keyof typeof ProposalState
            ] || "gray.500"
          }
        >
          <Text color="white">
            {`${proposal.stateLabel?.charAt(0).toUpperCase()}${proposal.stateLabel?.slice(1)}`}
          </Text>
        </Flex>
      </Flex>
      <Text>
        <strong>Proposal:</strong> {proposal.description}
      </Text>
      <Text>
        <strong>Proposed By: </strong>
        {proposal.proposer}
      </Text>

      {(proposal.votes.for > 0n ||
        proposal.votes.against > 0n ||
        proposal.votes.abstain > 0n) && (
        <>
          <Text mt="16px">
            <strong>For:</strong>{" "}
            {decimalQuery.isLoading
              ? "Loading..."
              : toTokens(proposal.votes.for, decimalQuery.data || 18)}
          </Text>
          <Text>
            <strong>Against:</strong>{" "}
            {decimalQuery.isLoading
              ? "Loading..."
              : toTokens(proposal.votes.against, decimalQuery.data || 18)}
          </Text>
          <Text>
            <strong>Abstained:</strong>{" "}
            {decimalQuery.isLoading
              ? "Loading..."
              : toTokens(proposal.votes.abstain, decimalQuery.data || 18)}
          </Text>
        </>
      )}

      {proposal.state === ProposalState.active &&
      !hasVoted &&
      !hasVotedLoading &&
      delegated ? (
        <Flex mt="24px" gap={2}>
          <TransactionButton
            size="sm"
            transactionCount={1}
            rightIcon={<Icon as={FiCheck} />}
            onClick={() => castVote(1)}
            colorScheme="green"
            isDisabled={isVoting && variables?.voteType !== 1}
            isLoading={isVoting && variables?.voteType === 1}
          >
            Approve
          </TransactionButton>
          <TransactionButton
            size="sm"
            transactionCount={1}
            rightIcon={<Icon as={FiX} />}
            onClick={() => castVote(0)}
            colorScheme="red"
            isDisabled={isVoting && variables?.voteType !== 0}
            isLoading={isVoting && variables?.voteType === 0}
          >
            Against
          </TransactionButton>
          <TransactionButton
            colorScheme="blackAlpha"
            size="sm"
            transactionCount={1}
            rightIcon={<Icon as={FiMinus} />}
            onClick={() => castVote(2)}
            isDisabled={isVoting && variables?.voteType !== 2}
            isLoading={isVoting && variables?.voteType === 2}
          >
            Abstain
          </TransactionButton>
        </Flex>
      ) : (
        canExecute && (
          <Button
            colorScheme="primary"
            size="sm"
            leftIcon={<Icon as={FiCheck} />}
            onClick={executeProposal}
            isLoading={isExecuting}
            mt="24px"
          >
            Execute
          </Button>
        )
      )}
    </Card>
  );
};
