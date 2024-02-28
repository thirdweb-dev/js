import { useRouter } from "next/router";
import { useContract } from "@thirdweb-dev/react";
import { BatchLazyMintButton } from "./components/batch-lazy-mint-button";
import { NFTClaimButton } from "./components/claim-button";
import { NFTLazyMintButton } from "./components/lazy-mint-button";
import { NFTMintButton } from "./components/mint-button";
import { NFTRevealButton } from "./components/reveal-button";
import { NFTSharedMetadataButton } from "./components/shared-metadata-button";
import { SupplyCards } from "./components/supply-cards";
import { NFTGetAllTable } from "./components/table";
import { Box, Flex } from "@chakra-ui/react";
import { detectFeatures } from "components/contract-components/utils";
import { Card, Heading, LinkButton, Text } from "tw-components";
import type { ThirdwebContract } from "thirdweb";
import { TokenIdPage } from "./components/token-id";

interface NftOverviewPageProps {
  contractAddress: string;
  contract: ThirdwebContract;
}

export const ContractNFTPage: React.FC<NftOverviewPageProps> = ({
  contractAddress,
  contract,
}) => {
  const contractQuery = useContract(contractAddress);

  const router = useRouter();
  const tokenId = router.query?.paths?.[2];

  const detectedState = detectFeatures(contractQuery?.contract, [
    "ERC721Enumerable",
    "ERC1155Enumerable",
    "ERC721Supply",
  ]);

  const isErc721 = detectFeatures(contractQuery?.contract, ["ERC721"]);

  const isErc721Claimable = detectFeatures(contractQuery?.contract, [
    "ERC721ClaimPhasesV1",
    "ERC721ClaimPhasesV2",
    "ERC721ClaimConditionsV1",
    "ERC721ClaimConditionsV2",
    "ERC721ClaimCustom",
  ]);

  if (tokenId && tokenId !== "-1") {
    return (
      <TokenIdPage
        oldContract={contractQuery.contract}
        contract={contract}
        tokenId={tokenId}
        isErc721={isErc721}
      />
    );
  }

  if (contractQuery.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Contract NFTs</Heading>
        <Flex gap={2} flexDir={{ base: "column", md: "row" }}>
          <NFTRevealButton contractQuery={contractQuery} />
          <NFTClaimButton contractQuery={contractQuery} />
          <NFTMintButton contractQuery={contractQuery} />
          <NFTSharedMetadataButton contractQuery={contractQuery} />
          <NFTLazyMintButton contractQuery={contractQuery} />
          <BatchLazyMintButton contractQuery={contractQuery} />
        </Flex>
      </Flex>
      {!detectedState ? (
        <Card as={Flex} flexDir="column" gap={3}>
          {/* TODO  extract this out into it's own component and make it better */}
          <Heading size="subtitle.md">
            No Supply/Enumerable extension enabled
          </Heading>
          <Text>
            To be able to see the list of the NFTs minted on your contract, you
            will have to extend the{" "}
            {isErc721 ? "ERC721Supply" : "ERC1155Enumerable"} extension in your
            contract.
          </Text>
          <Box>
            <LinkButton
              isExternal
              href="https://portal.thirdweb.com/contracts/build/extensions/erc-721/ERC721Supply"
              colorScheme="purple"
            >
              Learn more
            </LinkButton>
          </Box>
        </Card>
      ) : (
        <>
          {isErc721Claimable && contract && <SupplyCards contract={contract} />}
          {contract && contractQuery.contract && (
            <NFTGetAllTable
              contract={contract}
              oldContract={contractQuery.contract}
            />
          )}
        </>
      )}
    </Flex>
  );
};
