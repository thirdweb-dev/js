import { useWeb3 } from "@3rdweb-sdk/react";
import {
  useDelegateMutation,
  useTokensDelegated,
  useVoteContractMetadata,
  useVoteProposalList,
  useVoteTokenBalances,
} from "@3rdweb-sdk/react/hooks/useVote";
import { Spinner, Stack, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { useVote } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import {
  DelegateButton,
  ProposalButton,
} from "components/contract-pages/action-buttons/VoteButtons";
import { ContractLayout } from "components/contract-pages/contract-layout";
import { Proposal } from "components/contract-pages/vote/Proposal";
import { ContractPageNotice } from "components/notices/ContractPageNotice";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { ConsolePage } from "pages/_app";
import React, { useMemo } from "react";
import { Card, Text } from "tw-components";

const VotePage: ConsolePage = () => {
  const { address } = useWeb3();
  const voteAddress = useSingleQueryParam("vote");
  const contract = useVote(voteAddress);
  const metadata = useVoteContractMetadata(voteAddress);
  const data = useVoteProposalList(voteAddress);
  const { data: delegated, isLoading: isDelegatedLoading } = useTokensDelegated(
    contract?.getAddress(),
  );

  const balanceAddresses: string[] = useMemo(() => {
    return [address, voteAddress].filter((a) => !!a) as string[];
  }, [address, voteAddress]);

  const { data: balances, isLoading } = useVoteTokenBalances(
    voteAddress,
    balanceAddresses,
  );
  const { mutate: delegate } = useDelegateMutation(contract?.getAddress());

  const { Track } = useTrack({
    page: "vote",
    token: voteAddress,
  });

  const proposals = useMemo(() => {
    if (!data.data || data.data.length < 1) {
      return [];
    }

    const allProposals = data.data;
    return allProposals.map(
      (p, index) => allProposals[allProposals.length - 1 - index],
    );
  }, [data]);

  return (
    <Track>
      <ContractLayout
        contract={contract}
        metadata={metadata}
        data={data}
        primaryAction={
          delegated ? (
            <ProposalButton contract={contract} />
          ) : (
            <DelegateButton contract={contract} />
          )
        }
      >
        <Stack spacing={4}>
          {!isDelegatedLoading && !delegated && (
            <ContractPageNotice
              color="orange"
              action="Delegate Tokens"
              message={`
                You need to delegate voting tokens to this contract in order to create your own proposals or vote on others proposals.
              `}
              onClick={() => delegate()}
            />
          )}
          <Card>
            <Text size="label.lg" mb="8px">
              Voting Token Balances
            </Text>
            {isLoading ? (
              <Stack align="center">
                <Spinner mb="12px" />
              </Stack>
            ) : (
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
            )}
          </Card>
          {proposals.map((proposal) => (
            <Proposal
              key={proposal.proposalId.toString()}
              proposal={proposal}
            />
          ))}
        </Stack>
      </ContractLayout>
    </Track>
  );
};

VotePage.Layout = AppLayout;

export default VotePage;
