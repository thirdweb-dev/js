import { BatchLazyMintButton } from "./components/batch-lazy-mint-button";
import { NFTLazyMintButton } from "./components/lazy-mint-button";
import { NFTMintButton } from "./components/mint-button";
import { NFTRevealButton } from "./components/reveal-button";
import { NFTGetAllTable } from "./components/table";
import { Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { detectFeatures } from "components/contract-components/utils";
import { Card, Heading, Text } from "tw-components";

interface NftOverviewPageProps {
  contractAddress?: string;
}

export const ContractNFTPage: React.FC<NftOverviewPageProps> = ({
  contractAddress,
}) => {
  const contractQuery = useContract(contractAddress);

  const detectedState = detectFeatures(contractQuery?.contract, [
    "ERC721Enumerable",
    "ERC1155Enumerable",
    "ERC721Supply",
  ]);

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
        <Heading size="title.sm">Contract NFTs</Heading>
        <Flex gap={2} flexDir={{ base: "column", md: "row" }}>
          <NFTRevealButton contractQuery={contractQuery} />
          <NFTMintButton contractQuery={contractQuery} />
          <NFTLazyMintButton contractQuery={contractQuery} />
          <BatchLazyMintButton contractQuery={contractQuery} />
        </Flex>
      </Flex>
      {!detectedState ? (
        <Card as={Flex} flexDir="column" gap={3}>
          {/* TODO  extract this out into it's own component and make it better */}
          <Heading size="subtitle.md">No Enumerable extension enabled</Heading>
          <Text>
            To being able to see the list of the NFTs minted on your contract,
            you will have to extend the ERC721Enumerable extension in your
            contract.
          </Text>
        </Card>
      ) : (
        <NFTGetAllTable contract={contractQuery.contract} />
      )}
    </Flex>
  );
};
