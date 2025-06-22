"use client";

import { Divider, Flex, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { Card } from "chakra/card";
import { Heading } from "chakra/heading";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import * as VoteExt from "thirdweb/extensions/vote";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { voteTokenBalances } from "@/hooks/useVote";
import { DelegateButton } from "./components/delegate-button";
import { Proposal } from "./components/proposal";
import { ProposalButton } from "./components/proposal-button";

interface ProposalsPageProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

export const ContractProposalsPage: React.FC<ProposalsPageProps> = ({
  contract,
  isLoggedIn,
}) => {
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
    <Flex direction="column" gap={6}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Heading size="title.sm">Proposals</Heading>
        <div className="flex flex-col flex-wrap gap-3 md:flex-row">
          <DelegateButton contract={contract} isLoggedIn={isLoggedIn} />
          <ProposalButton contract={contract} isLoggedIn={isLoggedIn} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {proposals.map((proposal) => (
          <Proposal
            contract={contract}
            isLoggedIn={isLoggedIn}
            key={proposal.proposalId.toString()}
            proposal={proposal}
          />
        ))}
        <Divider />
        <Heading size="title.sm">Voting Tokens</Heading>
        <div className="flex flex-row gap-2">
          {voteTokenBalancesQuery.data?.map((balance) => (
            <Card as={Stat} key={balance.address} maxWidth="240px">
              <StatLabel>
                {balance.address?.toLowerCase() === address?.toLowerCase()
                  ? "Your Balance"
                  : "Contract Balance"}
              </StatLabel>
              <StatNumber>{balance.balance}</StatNumber>
            </Card>
          ))}
        </div>
      </div>
    </Flex>
  );
};
