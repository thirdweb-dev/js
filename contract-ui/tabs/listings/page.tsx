import { CreateListingButton } from "./components/list-button";
import { ListingsTable } from "./components/table";
import { Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { Heading } from "tw-components";

interface ListingsPageProps {
  contractAddress?: string;
}

export const ContractListingsPage: React.FC<ListingsPageProps> = ({
  contractAddress,
}) => {
  const contractQuery = useContract(contractAddress, "marketplace");

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
        <Heading size="title.sm">Contract Listings</Heading>
        <Flex gap={4}>
          <CreateListingButton contractQuery={contractQuery} />
        </Flex>
      </Flex>

      <ListingsTable contract={contractQuery.contract} />
    </Flex>
  );
};
