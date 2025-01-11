"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import {
  tokensDelegated,
  votingTokenDecimals,
} from "@3rdweb-sdk/react/hooks/useVote";
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
  twAccount: Account | undefined;
}

export const Proposal: React.FC<IProposal> = ({
  proposal,
  contract,
  twAccount,
}) => {
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
            twAccount={twAccount}
            txChainID={contract.chain.id}
            size="sm"
            transactionCount={1}
            onClick={() => castVote(1)}
            disabled={sendTx.isPending && voteType !== 1}
            isPending={sendTx.isPending && voteType === 1}
          >
            <div className="flex items-center gap-2">
              <CheckIcon className="size-4" />
              Approve
            </div>
          </TransactionButton>
          <TransactionButton
            twAccount={twAccount}
            txChainID={contract.chain.id}
            size="sm"
            transactionCount={1}
            onClick={() => castVote(0)}
            variant="destructive"
            disabled={sendTx.isPending && voteType !== 0}
            isPending={sendTx.isPending && voteType === 0}
          >
            <div className="flex items-center gap-2">
              <XIcon className="size-4" />
              Against
            </div>
          </TransactionButton>
          <TransactionButton
            twAccount={twAccount}
            txChainID={contract.chain.id}
            size="sm"
            transactionCount={1}
            onClick={() => castVote(2)}
            disabled={sendTx.isPending && voteType !== 2}
            isPending={sendTx.isPending && voteType === 2}
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
