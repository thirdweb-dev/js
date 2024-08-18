import { Box, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { detectFeatures } from "components/contract-components/utils";
import { useRouter } from "next/router";
import type { ThirdwebContract } from "thirdweb";
import { Card, Heading, LinkButton, Text } from "tw-components";
import { BatchLazyMintButton } from "./components/batch-lazy-mint-button";
import { NFTClaimButton } from "./components/claim-button";
import { NFTLazyMintButton } from "./components/lazy-mint-button";
import { NFTMintButton } from "./components/mint-button";
import { NFTRevealButton } from "./components/reveal-button";
import { NFTSharedMetadataButton } from "./components/shared-metadata-button";
import { SupplyCards } from "./components/supply-cards";
import { NFTGetAllTable } from "./components/table";
import { TokenIdPage } from "./components/token-id";

interface NftOverviewPageProps {
  contract: ThirdwebContract;
  isRevealable: boolean;
  detectedSharedMetadataState: ExtensionDetectedState;
  detectedClaimState: ExtensionDetectedState;
  isErc721Claimable: boolean;
  detectedStateEnumerable: boolean;
  detectedLazyMintState: ExtensionDetectedState;
  detectedRevealableState: ExtensionDetectedState;
  detectedLazyMintableState: ExtensionDetectedState;
  detectedMintableState: ExtensionDetectedState;
}

function isOnlyNumbers(str: string) {
  return /^\d+$/.test(str);
}

export const ContractNFTPage: React.FC<NftOverviewPageProps> = ({
  contract,
  isRevealable,
  detectedSharedMetadataState,
  detectedClaimState,
  isErc721Claimable,
  detectedStateEnumerable,
  detectedLazyMintState,
  detectedRevealableState,
  detectedLazyMintableState,
  detectedMintableState,
}) => {
  const contractQuery = useContract(contract.address);
  const router = useRouter();
  const tokenId = router.query?.paths?.[2];
  const isErc721 = detectFeatures(contractQuery?.contract, ["ERC721"]);

  if (tokenId && isOnlyNumbers(tokenId)) {
    return (
      <TokenIdPage
        contractQueryV4={contractQuery}
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
          {detectedRevealableState === "enabled" && contractQuery?.contract && (
            <NFTRevealButton contractQuery={contractQuery} />
          )}
          {detectedClaimState && contractQuery?.contract && isErc721 && (
            /**
             * This button is used for claiming NFT Drop contract (erc721) only!
             * For Edition Drop we have a dedicated ClaimTabERC1155 inside each Edition's page
             */
            <NFTClaimButton
              contractAddress={contractQuery.contract.getAddress()}
              chainId={contractQuery.contract.chainId}
            />
          )}
          {detectedMintableState === "enabled" && contractQuery?.contract && (
            <NFTMintButton contract={contract} isErc721={isErc721} />
          )}
          {detectedSharedMetadataState === "enabled" &&
            contractQuery?.contract && (
              <NFTSharedMetadataButton contract={contract} />
            )}
          {detectedLazyMintableState === "enabled" &&
            contractQuery?.contract && (
              <NFTLazyMintButton contract={contract} isErc721={isErc721} />
            )}
          {detectedLazyMintState === "enabled" && contractQuery?.contract && (
            <BatchLazyMintButton
              contractQuery={contractQuery}
              isRevealable={isRevealable}
            />
          )}
        </Flex>
      </Flex>
      {!detectedStateEnumerable ? (
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
            <NFTGetAllTable contract={contract} />
          )}
        </>
      )}
    </Flex>
  );
};
