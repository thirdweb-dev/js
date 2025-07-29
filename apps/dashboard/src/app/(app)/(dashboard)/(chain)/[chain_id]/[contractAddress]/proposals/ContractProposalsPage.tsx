"use client";

import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import * as VoteExt from "thirdweb/extensions/vote";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { voteTokenBalances } from "@/hooks/useVote";
import { StatCard } from "../overview/components/stat-card";
import { DelegateButton } from "./components/delegate-button";
import { Proposal } from "./components/proposal";
import { ProposalButton } from "./components/proposal-button";

type ProposalsPageProps = {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
};

export function ContractProposalsPage({
  contract,
  isLoggedIn,
}: ProposalsPageProps) {
  const address = useActiveAccount()?.address;
  const proposalsQuery = useReadContract(VoteExt.getAll, {
    contract,
  });
  const balanceAddresses: string[] = useMemo(() => {
    return [address, contract.address].filter((a) => !!a) as string[];
  }, [address, contract.address]);
  const proposals = useMemo(
    () => (proposalsQuery.data || []).reverse(),
    [proposalsQuery.data],
  );
  const voteTokenBalancesQuery = useReadContract(voteTokenBalances, {
    addresses: balanceAddresses,
    contract,
    queryOptions: {
      enabled: balanceAddresses.length > 0,
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">Proposals</h2>
        <div className="flex flex-col flex-wrap gap-3 md:flex-row">
          <DelegateButton contract={contract} isLoggedIn={isLoggedIn} />
          <ProposalButton contract={contract} isLoggedIn={isLoggedIn} />
        </div>
      </div>

      <div className="mb-6">
        {proposals.length > 0 && (
          <div className="space-y-6">
            {proposals.map((proposal) => (
              <Proposal
                contract={contract}
                isLoggedIn={isLoggedIn}
                key={proposal.proposalId.toString()}
                proposal={proposal}
              />
            ))}
          </div>
        )}

        {proposals.length === 0 && (
          <div className="flex flex-col gap-2 py-20 border rounded-md bg-card justify-center items-center">
            <p className="text-muted-foreground">No proposals found</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Voting Tokens</h2>
        <div className="flex flex-row gap-3">
          {voteTokenBalancesQuery.data?.map((balance) => (
            <StatCard
              isPending={voteTokenBalancesQuery.isPending}
              label={
                balance.address?.toLowerCase() === address?.toLowerCase()
                  ? "Your Balance"
                  : "Contract Balance"
              }
              value={balance.balance}
              key={balance.address}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
