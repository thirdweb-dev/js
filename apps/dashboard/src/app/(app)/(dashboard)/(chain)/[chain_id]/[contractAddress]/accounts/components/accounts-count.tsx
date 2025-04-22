"use client";

import {
  SimpleGrid,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import type { ThirdwebContract } from "thirdweb";
import { totalAccounts } from "thirdweb/extensions/erc4337";
import { useReadContract } from "thirdweb/react";
import { Card } from "tw-components";

type AccountsCountProps = {
  contract: ThirdwebContract;
};

export const AccountsCount: React.FC<AccountsCountProps> = ({ contract }) => {
  const totalAccountsQuery = useReadContract(totalAccounts, { contract });
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 3, md: 6 }}>
      <Card as={Stat}>
        <StatLabel mb={{ base: 1, md: 0 }}>Total Accounts</StatLabel>
        <Skeleton isLoaded={totalAccountsQuery.isSuccess}>
          <StatNumber>{totalAccountsQuery.data?.toString()}</StatNumber>
        </Skeleton>
      </Card>
    </SimpleGrid>
  );
};
