import {
  SimpleGrid,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { useAccounts } from "@thirdweb-dev/react";
import { Card } from "tw-components";

interface AccountsCountProps {
  accountsQuery: ReturnType<typeof useAccounts>;
}

export const AccountsCount: React.FC<AccountsCountProps> = ({
  accountsQuery,
}) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 3, md: 6 }}>
      <Card as={Stat}>
        <StatLabel mb={{ base: 1, md: 0 }}>Total Accounts</StatLabel>
        <Skeleton isLoaded={accountsQuery.isSuccess}>
          <StatNumber>{accountsQuery?.data?.length || 0}</StatNumber>
        </Skeleton>
      </Card>
    </SimpleGrid>
  );
};
