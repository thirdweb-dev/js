"use client";

import { Button } from "chakra/button";
import { Card } from "chakra/card";
import { Text } from "chakra/text";
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
import { TransactionButton } from "@/components/tx-button";
import { tokensDelegated, votingTokenDecimals } from "@/hooks/useVote";

const ProposalStateToMetadataMap: Record<
  keyof typeof VoteExt.ProposalState,
  string
> = {
  active: "primary.500",
  canceled: "red.500",
  defeated: "red.500",
  executed: "green.500",
  expired: "gray.500",
  pending: "gray.500",
  queued: "yellow.500",
  succeeded: "green.500",
};

interface IProposal {
  proposal: VoteExt.ProposalItem;
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

export const Proposal: React.FC<IProposal> = ({
  proposal,
  contract,
  isLoggedIn,
}) => {
  const account = useActiveAccount();
  const hasVotedQuery = useReadContract(VoteExt.hasVoted, {
    account: account?.address || "",
    contract,
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
    account,
    contract,
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
      error: "Error casting vote",
      loading: "Casting vote...",
      onAutoClose: () => setVoteType(null),
      success: "Vote cast successfully",
    });
  }

  return (
    <Card key={proposal.proposalId.toString()}>
      <div
        className="mb-2 rounded-md bg-gray-500 px-4 py-0"
        style={{
          background:
            ProposalStateToMetadataMap[
              proposal.stateLabel as keyof typeof VoteExt.ProposalState
            ] || undefined,
        }}
      >
        <Text color="white">
          {`${proposal.stateLabel?.charAt(0).toUpperCase()}${proposal.stateLabel?.slice(1)}`}
        </Text>
      </div>
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
        <div className="mt-6 flex gap-2">
          <TransactionButton
            client={contract.client}
            disabled={sendTx.isPending && voteType !== 1}
            isLoggedIn={isLoggedIn}
            isPending={sendTx.isPending && voteType === 1}
            onClick={() => castVote(1)}
            size="sm"
            transactionCount={1}
            txChainID={contract.chain.id}
          >
            <div className="flex items-center gap-2">
              <CheckIcon className="size-4" />
              Approve
            </div>
          </TransactionButton>
          <TransactionButton
            client={contract.client}
            disabled={sendTx.isPending && voteType !== 0}
            isLoggedIn={isLoggedIn}
            isPending={sendTx.isPending && voteType === 0}
            onClick={() => castVote(0)}
            size="sm"
            transactionCount={1}
            txChainID={contract.chain.id}
            variant="destructive"
          >
            <div className="flex items-center gap-2">
              <XIcon className="size-4" />
              Against
            </div>
          </TransactionButton>
          <TransactionButton
            client={contract.client}
            disabled={sendTx.isPending && voteType !== 2}
            isLoggedIn={isLoggedIn}
            isPending={sendTx.isPending && voteType === 2}
            onClick={() => castVote(2)}
            size="sm"
            transactionCount={1}
            txChainID={contract.chain.id}
          >
            <div className="flex items-center gap-2">
              <MinusIcon className="size-4" />
              Abstain
            </div>
          </TransactionButton>
        </div>
      ) : (
        canExecuteQuery.data && (
          <Button
            colorScheme="primary"
            isLoading={sendTx.isPending}
            leftIcon={<CheckIcon />}
            mt="24px"
            onClick={() => {
              const executeTx = VoteExt.executeProposal({
                contract,
                proposalId: proposal.proposalId,
              });
              toast.promise(sendTx.mutateAsync(executeTx), {
                error: "Error executing proposal",
                loading: "Executing proposal...",
                success: "Proposal executed successfully",
              });
            }}
            size="sm"
          >
            Execute
          </Button>
        )
      )}
    </Card>
  );
};
