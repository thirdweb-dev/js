"use client";

import type { VariantProps } from "class-variance-authority";
import { CheckIcon, MinusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type ThirdwebContract, toTokens } from "thirdweb";
import * as VoteExt from "thirdweb/extensions/vote";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { TransactionButton } from "@/components/tx-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSendAndConfirmTx } from "@/hooks/useSendTx";
import { tokensDelegated, votingTokenDecimals } from "@/hooks/useVote";
import { parseError } from "@/utils/errorParser";

const badgeVariantMap: Record<
  keyof typeof VoteExt.ProposalState,
  VariantProps<typeof Badge>["variant"]
> = {
  active: "default",
  canceled: "destructive",
  defeated: "destructive",
  executed: "success",
  expired: "outline",
  pending: "outline",
  queued: "warning",
  succeeded: "success",
};

type ProposalProps = {
  proposal: VoteExt.ProposalItem;
  contract: ThirdwebContract;
  isLoggedIn: boolean;
};

export function Proposal({ proposal, contract, isLoggedIn }: ProposalProps) {
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

  const sendTx = useSendAndConfirmTx();

  const [voteType, setVoteType] = useState<VoteExt.VoteType | null>(null);

  function castVote(vote: VoteExt.VoteType) {
    setVoteType(vote);

    const castVoteTx = VoteExt.castVote({
      contract,
      proposalId: proposal.proposalId,
      support: vote,
    });

    toast.promise(sendTx.mutateAsync(castVoteTx), {
      error: (error) => {
        return {
          message: "Error casting vote",
          description: parseError(error),
        };
      },
      success: "Vote cast successfully",
    });
  }

  return (
    <Card key={proposal.proposalId.toString()}>
      <CardContent className="p-6 relative">
        <div className="absolute top-4 right-4">
          <Badge
            className="text-sm"
            variant={
              badgeVariantMap[
                proposal.stateLabel as keyof typeof VoteExt.ProposalState
              ]
            }
          >
            {proposal.stateLabel}
          </Badge>
        </div>

        <div className="space-y-1 mb-4">
          <div className="text-sm font-medium">Proposal</div>
          <h3 className="text-base text-muted-foreground">
            {proposal.description}
          </h3>
        </div>

        <div className="space-y-1 mb-4">
          <div className="text-sm font-medium">Proposed By </div>
          <WalletAddress
            address={proposal.proposer}
            client={contract.client}
            iconClassName="size-4"
            className="h-auto py-1"
          />
        </div>

        {(proposal.votes.for > 0n ||
          proposal.votes.against > 0n ||
          proposal.votes.abstain > 0n) && (
          <div className="flex items-center gap-10">
            <div className="text-sm">
              <div className="font-medium">For</div>{" "}
              <div className="text-base">
                {decimalQuery.isPending
                  ? "Loading..."
                  : toTokens(proposal.votes.for, decimalQuery.data || 18)}
              </div>
            </div>

            <div className="text-sm">
              <div className="font-medium">Against</div>{" "}
              <div className="text-base">
                {decimalQuery.isPending
                  ? "Loading..."
                  : toTokens(proposal.votes.against, decimalQuery.data || 18)}
              </div>
            </div>

            <div className="text-sm">
              <div className="font-medium">Abstained</div>{" "}
              <div className="text-base">
                {decimalQuery.isPending
                  ? "Loading..."
                  : toTokens(proposal.votes.abstain, decimalQuery.data || 18)}
              </div>
            </div>
          </div>
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
              variant="primary"
              disabled={sendTx.isPending}
              className="mt-6"
              size="sm"
              onClick={() => {
                const executeTx = VoteExt.executeProposal({
                  contract,
                  proposalId: proposal.proposalId,
                });
                toast.promise(sendTx.mutateAsync(executeTx), {
                  error: (error) => {
                    return {
                      message: "Error executing proposal",
                      description: parseError(error),
                    };
                  },
                  success: "Proposal executed successfully",
                });
              }}
            >
              <CheckIcon className="mr-2 h-4 w-4" />
              Execute
            </Button>
          )
        )}
      </CardContent>
    </Card>
  );
}
