import { DelegateButton } from "./components/delegate-button";
import { Proposal } from "./components/proposal";
import { ProposalButton } from "./components/proposal-button";
import {
  useVoteProposalList,
  useVoteTokenBalances,
} from "@3rdweb-sdk/react/hooks/useVote";
import {
  Divider,
  Flex,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { Vote } from "@thirdweb-dev/sdk/dist/declarations/src/contracts/prebuilt-implementations/vote";
import { useMemo } from "react";
import { Card, Heading } from "tw-components";

interface ProposalsPageProps {
  contractAddress?: string;
}

export const ContractProposalsPage: React.FC<ProposalsPageProps> = ({
  contractAddress,
}) => {
  const address = useAddress();
  const contractQuery = useContract<Vote>(contractAddress);

  const data = useVoteProposalList(contractQuery.contract);

  const balanceAddresses: string[] = useMemo(() => {
    return [address, contractAddress].filter((a) => !!a) as string[];
  }, [address, contractAddress]);

  const proposals = useMemo(() => {
    if (!data.data || data.data.length < 1) {
      return [];
    }

    const allProposals = data.data;
    return allProposals.map(
      (p, index) => allProposals[allProposals.length - 1 - index],
    );
  }, [data]);

  const { data: balances } = useVoteTokenBalances(
    contractQuery.contract,
    balanceAddresses,
  );

  if (contractQuery.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (!contractQuery?.contract) {
    return null;
  }

  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Proposals</Heading>
        <Flex gap={4}>
          <DelegateButton contract={contractQuery.contract} />
          <ProposalButton contract={contractQuery.contract} />
        </Flex>
      </Flex>
      <Stack spacing={4}>
        {proposals.map((proposal) => (
          <Proposal
            key={proposal.proposalId.toString()}
            contract={contractQuery.contract}
            proposal={proposal}
          />
        ))}
        <Divider />
        <Heading size="title.sm">Voting Tokens</Heading>
        <Stack direction="row">
          {balances?.map((balance) => (
            <Card as={Stat} key={balance.address} maxWidth="240px">
              <StatLabel>
                {balance.address?.toLowerCase() === address?.toLowerCase()
                  ? "Your Balance"
                  : "Contract Balance"}
              </StatLabel>
              <StatNumber>{balance.balance}</StatNumber>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Flex>
  );
};
