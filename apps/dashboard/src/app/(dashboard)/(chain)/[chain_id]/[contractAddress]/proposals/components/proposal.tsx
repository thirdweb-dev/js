"use client";

import {
  tokensDelegated,
  votingTokenDecimals,
} from "@3rdweb-sdk/react/hooks/useVote";
import { Flex } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { CheckIcon, MinusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type ThirdwebContract, toTokens } from "thirdweb";
import * as VoteExt from "thirdweb/extensions/vote";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { Button, Card, Text } from "tw-components";

const ProposalStateToMetadataMap: Record<
  keyof typeof VoteExt.ProposalState,
  string
> = {
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
  proposal: VoteExt.ProposalItem;
  contract: ThirdwebContract;
}

export const Proposal: React.FC<IProposal> = ({ proposal, contract }) => {
  const account = useActiveAccount();
  const hasVotedQuery = useReadContract(VoteExt.hasVoted, {
    contract,
    account: account?.address || "",
    proposalId: proposal.proposalId,
    queryOptions: {
      enabled: !!account,
    },
  });
  const canExecuteQuery = useReadContract(VoteExt.canExecute, {
    contract,
    proposalId: proposal.proposalId,
  });
  const decimalQuery = useReadContract(votingTokenDecimals, {
    contract,
  });
  const tokensDelegatedQuery = useReadContract(tokensDelegated, {
    contract,
    account,
    queryOptions: { enabled: !!account },
  });

  const sendTx = useSendAndConfirmTransaction();

  const [voteType, setVoteType] = useState<VoteExt.VoteType | null>(null);

  function castVote(vote: VoteExt.VoteType) {
    setVoteType(vote);
    const castVoteTx = VoteExt.castVote({
      contract,
      proposalId: proposal.proposalId,
      support: vote,
    });
    toast.promise(sendTx.mutateAsync(castVoteTx), {
      loading: "Casting vote...",
      success: "Vote cast successfully",
      error: "Error casting vote",
      onAutoClose: () => setVoteType(null),
    });
  }

  return (
    <Card key={proposal.proposalId.toString()}>
      <Flex mb="8px">
        <Flex
          paddingY="0px"
          paddingX="16px"
          borderRadius="25px"
          bg={
            ProposalStateToMetadataMap[
              proposal.stateLabel as keyof typeof VoteExt.ProposalState
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
            {decimalQuery.isPending
              ? "Loading..."
              : toTokens(proposal.votes.for, decimalQuery.data || 18)}
          </Text>
          <Text>
            <strong>Against:</strong>{" "}
            {decimalQuery.isPending
              ? "Loading..."
              : toTokens(proposal.votes.against, decimalQuery.data || 18)}
          </Text>
          <Text>
            <strong>Abstained:</strong>{" "}
            {decimalQuery.isPending
              ? "Loading..."
              : toTokens(proposal.votes.abstain, decimalQuery.data || 18)}
          </Text>
        </>
      )}

      {proposal.state === VoteExt.ProposalState.active &&
      !hasVotedQuery.data &&
      !hasVotedQuery.isPending &&
      tokensDelegatedQuery.data ? (
        <Flex mt="24px" gap={2}>
          <TransactionButton
            txChainID={contract.chain.id}
            size="sm"
            transactionCount={1}
            rightIcon={<CheckIcon />}
            onClick={() => castVote(1)}
            colorScheme="green"
            isDisabled={sendTx.isPending && voteType !== 1}
            isLoading={sendTx.isPending && voteType === 1}
          >
            Approve
          </TransactionButton>
          <TransactionButton
            txChainID={contract.chain.id}
            size="sm"
            transactionCount={1}
            rightIcon={<XIcon />}
            onClick={() => castVote(0)}
            colorScheme="red"
            isDisabled={sendTx.isPending && voteType !== 0}
            isLoading={sendTx.isPending && voteType === 0}
          >
            Against
          </TransactionButton>
          <TransactionButton
            txChainID={contract.chain.id}
            colorScheme="blackAlpha"
            size="sm"
            transactionCount={1}
            rightIcon={<MinusIcon />}
            onClick={() => castVote(2)}
            isDisabled={sendTx.isPending && voteType !== 2}
            isLoading={sendTx.isPending && voteType === 2}
          >
            Abstain
          </TransactionButton>
        </Flex>
      ) : (
        canExecuteQuery.data && (
          <Button
            colorScheme="primary"
            size="sm"
            leftIcon={<CheckIcon />}
            onClick={() => {
              const executeTx = VoteExt.executeProposal({
                contract,
                proposalId: proposal.proposalId,
              });
              toast.promise(sendTx.mutateAsync(executeTx), {
                loading: "Executing proposal...",
                success: "Proposal executed successfully",
                error: "Error executing proposal",
              });
            }}
            isLoading={sendTx.isPending}
            mt="24px"
          >
            Execute
          </Button>
        )
      )}
    </Card>
  );
};
