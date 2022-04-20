import {
  useCanExecuteProposal,
  useCastVoteMutation,
  useExecuteProposalMutation,
  useHasVotedOnProposal,
  useTokensDelegated,
} from "@3rdweb-sdk/react/hooks/useVote";
import { Flex, Icon, Stack, Text } from "@chakra-ui/react";
import {
  ProposalState,
  Proposal as ProposalType,
  VoteType,
} from "@thirdweb-dev/sdk";
import { Button } from "components/buttons/Button";
import { Card } from "components/layout/Card";
import { ethers } from "ethers";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useTxNotifications } from "hooks/useTxNotifications";
import React, { useCallback, useMemo } from "react";
import { FiCheck, FiMinus, FiX } from "react-icons/fi";

interface IProposalMetadata {
  color: string;
  title: string;
}

const ProposalStateToMetadataMap: Record<ProposalState, IProposalMetadata> = {
  [ProposalState.Pending]: {
    // Vote hasnt started yet
    color: "gray.500",
    title: "Pending",
  },
  [ProposalState.Active]: {
    // Vote is ongoing
    color: "blue.500",
    title: "Active",
  },
  [ProposalState.Canceled]: {
    // Proposal cancelled before vote was closed
    color: "red.500",
    title: "Canceled",
  },
  [ProposalState.Defeated]: {
    // Proposal was defeated
    color: "red.500",
    title: "Defeated",
  },
  [ProposalState.Succeeded]: {
    // Proposal was successful
    color: "green.500",
    title: "Succeeded",
  },
  [ProposalState.Queued]: {
    // Proposal execution transaction is pending
    color: "yellow.500",
    title: "Queued",
  },
  [ProposalState.Expired]: {
    // Proposal expired?
    color: "gray.500",
    title: "Expired",
  },
  [ProposalState.Executed]: {
    // Proposal has been executed
    color: "green.500",
    title: "Executed",
  },
};

interface IProposal {
  proposal: ProposalType;
}

export const Proposal: React.FC<IProposal> = ({ proposal }) => {
  const voteAddress = useSingleQueryParam("vote");
  const { data: hasVoted, isLoading: hasVotedLoading } = useHasVotedOnProposal(
    proposal.proposalId.toString(),
    voteAddress,
  );
  const { data: canExecute } = useCanExecuteProposal(
    proposal.proposalId.toString(),
    voteAddress,
  );
  const { data: delegated } = useTokensDelegated(voteAddress);
  const { mutate: execute, isLoading: isExecuting } =
    useExecuteProposalMutation(proposal.proposalId.toString(), voteAddress);
  const { mutate: vote, isLoading: isVoting } = useCastVoteMutation(
    proposal.proposalId.toString(),
    voteAddress,
  );

  const votes = useMemo(() => {
    return {
      for: parseFloat(
        ethers.utils.formatUnits(
          proposal.votes.find((voteData) => voteData.type === VoteType.For)
            ?.count || 0,
          18,
        ),
      ),
      against: parseFloat(
        ethers.utils.formatUnits(
          proposal.votes.find((voteData) => voteData.type === VoteType.Against)
            ?.count || 0,
          18,
        ),
      ),
      abstain: parseFloat(
        ethers.utils.formatUnits(
          proposal.votes.find((voteData) => voteData.type === VoteType.Abstain)
            ?.count || 0,
          18,
        ),
      ),
    };
  }, [proposal]);

  const { onSuccess: castVoteSuccess, onError: castVoteError } =
    useTxNotifications("Vote cast succesfully", "Error casting vote");

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
      "Proposal executed succesfully",
      "Error executing proposal",
    );

  const executeProposal = useCallback(() => {
    execute(undefined, {
      onSuccess: executeSuccess,
      onError: executeError,
    });
  }, [execute, executeError, executeSuccess]);

  return (
    <Card key={proposal.proposalId.toString()}>
      <Flex mb="8px">
        <Flex
          paddingY="0px"
          paddingX="16px"
          borderRadius="25px"
          bg={ProposalStateToMetadataMap[proposal.state].color}
        >
          <Text color="white">
            {ProposalStateToMetadataMap[proposal.state].title}
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

      {(votes.for > 0 || votes.against > 0 || votes.abstain > 0) && (
        <>
          <Text mt="16px">
            <strong>For:</strong> {votes.for}
          </Text>
          <Text>
            <strong>Against:</strong> {votes.against}
          </Text>
          <Text>
            <strong>Abstained:</strong> {votes.abstain}
          </Text>
        </>
      )}

      {proposal.state === ProposalState.Active &&
      !hasVoted &&
      !hasVotedLoading &&
      delegated ? (
        <Stack direction="row" spacing={2} mt="24px">
          {isVoting ? (
            <Button width="80px" size="sm" isLoading />
          ) : (
            <>
              <Button
                width="80px"
                size="sm"
                leftIcon={<Icon as={FiCheck} />}
                onClick={() => castVote(1)}
              >
                For
              </Button>
              <Button
                width="80px"
                size="sm"
                leftIcon={<Icon as={FiX} />}
                onClick={() => castVote(0)}
              >
                Against
              </Button>
              <Button
                width="80px"
                size="sm"
                leftIcon={<Icon as={FiMinus} />}
                onClick={() => castVote(2)}
              >
                Abstain
              </Button>
            </>
          )}
        </Stack>
      ) : (
        canExecute && (
          <Button
            colorScheme="blue"
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
