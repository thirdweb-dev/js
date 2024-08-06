import { Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { Heading } from "tw-components";
/* import { CreateListingButton } from "./components/list-button"; */
import { CreateListingButton } from "../shared-components/list-button";
import { DirectListingsTable } from "./components/table";

interface ContractDirectListingsPageProps {
  contractAddress?: string;
}

export const ContractDirectListingsPage: React.FC<
  ContractDirectListingsPageProps
> = ({ contractAddress }) => {
  const contractQuery = useContract(contractAddress, "marketplace-v3");

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
          <CreateListingButton
            contractAddress={contractQuery.contract.getAddress()}
            chainId={contractQuery.contract.chainId}
            type="direct-listings"
            createText="Create Direct Listing"
          />
        </Flex>
      </Flex>

      <DirectListingsTable
        contractAddress={contractQuery.contract.getAddress()}
        chainId={contractQuery.contract.chainId}
      />
    </Flex>
  );
};
