import { NftGetAllTable } from "./components/table";
import { Flex } from "@chakra-ui/react";
import { NFTContract } from "@thirdweb-dev/react";
import { Heading } from "tw-components";

interface NftOverviewPageProps {
  contract: NFTContract;
}

export const ContractNFTPage: React.FC<NftOverviewPageProps> = ({
  contract,
}) => {
  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Contract NFTs</Heading>
        {/* TODO add erc721 & 1155 mint flow here */}
      </Flex>
      {/* TODO check if this is supported before rendering it */}
      <NftGetAllTable contract={contract} />
    </Flex>
  );
};
