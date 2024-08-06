import { Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { Heading } from "tw-components";
import { CreateListingButton } from "../shared-components/list-button";
import { EnglishAuctionsTable } from "./components/table";

interface ContractEnglishAuctionsProps {
  contractAddress?: string;
}

export const ContractEnglishAuctionsPage: React.FC<
  ContractEnglishAuctionsProps
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
        <Heading size="title.sm">Contract Auctions</Heading>
        <Flex gap={4}>
          <CreateListingButton
            contractAddress={contractQuery.contract.getAddress()}
            chainId={contractQuery.contract.chainId}
            type="english-auctions"
            createText="Create English Auction"
          />
        </Flex>
      </Flex>

      <EnglishAuctionsTable
        contractAddress={contractQuery.contract.getAddress()}
        chainId={contractQuery.contract.chainId}
      />
    </Flex>
  );
};
