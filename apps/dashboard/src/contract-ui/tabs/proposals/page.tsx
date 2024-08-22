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
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { Card, Heading } from "tw-components";
import { DelegateButton } from "./components/delegate-button";
import { Proposal } from "./components/proposal";
import { ProposalButton } from "./components/proposal-button";

interface ProposalsPageProps {
  contract: ThirdwebContract;
}

export const ContractProposalsPage: React.FC<ProposalsPageProps> = ({
  contract,
}) => {
  const address = useActiveAccount()?.address;
  const data = useVoteProposalList(contract);

  const balanceAddresses: string[] = useMemo(() => {
    return [address, contract.address].filter((a) => !!a) as string[];
  }, [address, contract.address]);

  const proposals = useMemo(() => (data.data || []).reverse(), [data]);

  const { data: balances } = useVoteTokenBalances(contract, balanceAddresses);

  if (!contract) {
    return null;
  }
  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Proposals</Heading>
        <Flex gap={4}>
          <DelegateButton contract={contract} />
          <ProposalButton contract={contract} />
        </Flex>
      </Flex>
      <Stack spacing={4}>
        {proposals.map((proposal) => (
          <Proposal
            key={proposal.proposalId.toString()}
            contract={contract}
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
