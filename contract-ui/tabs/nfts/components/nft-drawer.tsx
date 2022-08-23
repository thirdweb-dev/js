import { AirdropTab } from "./airdrop-tab";
import { BurnTab } from "./burn-tab";
import { MintSupplyTab } from "./mint-supply-tab";
import { TransferTab } from "./transfer-tab";
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  chakra,
  usePrevious,
} from "@chakra-ui/react";
import {
  NFT,
  NFTContract,
  ThirdwebNftMedia,
  useAddress,
  useNFTBalance,
} from "@thirdweb-dev/react";
import { Erc721, Erc1155 } from "@thirdweb-dev/sdk";
import { ClaimConditions } from "contract-ui/tabs/claim-conditions/components/claim-conditions";
import { BigNumber } from "ethers";
import { Card, Drawer, Heading, Text } from "tw-components";

interface NFTDrawerProps {
  contract: NFTContract;
  isOpen: boolean;
  onClose: () => void;
  data: NFT<NFTContract> | null;
}

const ChakraThirdwebNftMedia = chakra(ThirdwebNftMedia);

export const NFTDrawer: React.FC<NFTDrawerProps> = ({
  isOpen,
  onClose,
  data,
  contract,
}) => {
  const address = useAddress();
  const balanceOf = useNFTBalance(
    contract instanceof Erc1155 ? contract : undefined,
    address,
    data?.metadata.id,
  );

  const prevData = usePrevious(data);

  const renderData = data || prevData;

  if (!renderData) {
    return null;
  }

  const isERC1155 = contract instanceof Erc1155;
  const isERC721 = contract instanceof Erc721;
  const isOwner =
    (isERC1155 && BigNumber.from(balanceOf?.data || 0).gt(0)) ||
    (isERC721 && renderData.owner === address);

  const isBurnable = detectBurnable(contract);
  const isMintable = detectMintable(contract);
  const isClaimable = detectClaimable(contract);

  const tokenId = renderData?.metadata.id.toString();

  return (
    <Drawer
      allowPinchZoom
      preserveScrollBarGap
      size="xl"
      onClose={onClose}
      isOpen={isOpen}
    >
      <Flex py={6} px={2} flexDir="column" gap={6}>
        <Flex gap={6}>
          <ChakraThirdwebNftMedia
            metadata={renderData.metadata}
            requireInteraction
            flexShrink={0}
            boxSize={32}
            objectFit="contain"
          />
          <Flex flexDir="column" gap={2} w="70%">
            <Heading size="title.lg">{renderData.metadata.name}</Heading>
            <Text size="label.md" noOfLines={6}>
              {renderData.metadata.description}
            </Text>
          </Flex>
        </Flex>
        <Card as={Flex} flexDir="column" gap={2} p={0}>
          <Tabs isLazy lazyBehavior="keepMounted">
            <TabList
              px={0}
              borderBottomColor="borderColor"
              borderBottomWidth="1px"
              overflowX={{ base: "auto", md: "inherit" }}
            >
              <Tab gap={2}>Details</Tab>
              <Tab gap={2} isDisabled={!isOwner}>
                Transfer
              </Tab>
              {isERC1155 && (
                <Tab gap={2} isDisabled={!isOwner}>
                  Airdrop
                </Tab>
              )}
              {isBurnable && (
                <Tab gap={2} isDisabled={!isOwner}>
                  Burn
                </Tab>
              )}
              {isMintable && isERC1155 && <Tab gap={2}>Mint</Tab>}
              {isClaimable && isERC1155 && <Tab gap={2}>Claim Conditions</Tab>}
            </TabList>

            <TabPanels px={{ base: 4, md: 6 }} py={2}>
              <TabPanel px={0}>
                <Flex flexDir="column" gap={3}>
                  <Text size="label.md">Token ID: {tokenId}</Text>
                  {isERC721 && (
                    <Text size="label.md">Owner: {renderData.owner}</Text>
                  )}
                  <Text size="label.md">Token Standard: {renderData.type}</Text>
                  {isERC1155 && (
                    <Text size="label.md">
                      Supply: {renderData.supply.toString()}
                    </Text>
                  )}
                </Flex>
              </TabPanel>

              <TabPanel px={0}>
                <TransferTab contract={contract} tokenId={tokenId} />
              </TabPanel>
              {isERC1155 && (
                <TabPanel>
                  <AirdropTab contract={contract} tokenId={tokenId} />
                </TabPanel>
              )}
              {isBurnable && (
                <TabPanel>
                  <BurnTab contract={contract} tokenId={tokenId} />
                </TabPanel>
              )}
              {isMintable && isERC1155 && (
                <TabPanel>
                  <MintSupplyTab contract={contract} tokenId={tokenId} />
                </TabPanel>
              )}
              {isClaimable && isERC1155 && (
                <TabPanel>
                  <ClaimConditions
                    contract={contract}
                    tokenId={tokenId}
                    isColumn
                  />
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </Card>
      </Flex>
    </Drawer>
  );
};

export function detectBurnable(contract?: NFTContract) {
  if (!contract) {
    return undefined;
  }
  if ("burn" in contract) {
    return !!contract?.burn;
  }
  return undefined;
}

export function detectMintable(contract?: NFTContract) {
  if (!contract) {
    return undefined;
  }
  if ("mint" in contract) {
    return !!contract?.mint;
  }
  return undefined;
}

export function detectClaimable(contract?: NFTContract) {
  if (!contract) {
    return undefined;
  }
  if ("drop" in contract) {
    return !!contract?.drop?.claim;
  }
  return undefined;
}
