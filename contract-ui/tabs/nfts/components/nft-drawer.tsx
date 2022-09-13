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
  DropContract,
  Erc721OrErc1155,
  NFT,
  NFTContract,
  ThirdwebNftMedia,
  getErcs,
  useAddress,
  useNFTBalance,
} from "@thirdweb-dev/react";
import { detectFeatures } from "components/contract-components/utils";
import { ClaimConditions } from "contract-ui/tabs/claim-conditions/components/claim-conditions";
import { BigNumber } from "ethers";
import { useMemo } from "react";
import { Card, CodeBlock, Drawer, Heading, Text } from "tw-components";

interface NFTDrawerProps {
  contract: NFTContract;
  isOpen: boolean;
  onClose: () => void;
  data: NFT<Erc721OrErc1155> | null;
}

const ChakraThirdwebNftMedia = chakra(ThirdwebNftMedia);

export const NFTDrawer: React.FC<NFTDrawerProps> = ({
  isOpen,
  onClose,
  data,
  contract,
}) => {
  const address = useAddress();
  const balanceOf = useNFTBalance(contract, address, data?.metadata.id);

  const { erc1155 } = getErcs(contract);

  const prevData = usePrevious(data);

  const renderData = data || prevData;

  const isERC1155 = detectFeatures(contract, ["ERC1155"]);
  const isERC721 = detectFeatures(contract, ["ERC721"]);

  const isBurnable = detectFeatures(contract, [
    "ERC721Burnable",
    "ERC1155Burnable",
  ]);

  const isMintable = detectFeatures(contract, ["ERC1155Mintable"]);

  const isClaimable = detectFeatures<DropContract>(contract, [
    "ERC1155ClaimableWithConditions",
  ]);

  const isOwner =
    (isERC1155 && BigNumber.from(balanceOf?.data || 0).gt(0)) ||
    (isERC721 && renderData?.owner === address);

  const tokenId = renderData?.metadata.id.toString() || "";

  const tabs = useMemo(() => {
    if (!renderData) {
      return [];
    }
    let t = [
      {
        title: "Details",
        isDisabled: false,
        children: () => (
          <Flex flexDir="column" gap={4}>
            <Card as={Flex} flexDir="column" gap={3}>
              <Text size="label.md">Token ID: {tokenId}</Text>
              {isERC721 && (
                <Text size="label.md">Owned by: {renderData.owner}</Text>
              )}
              <Text size="label.md">Token Standard: {renderData.type}</Text>
              {isERC1155 && (
                <Text size="label.md">
                  Supply: {renderData.supply.toString()}
                </Text>
              )}
            </Card>
            {data?.metadata.attributes || data?.metadata.properties ? (
              <Card as={Flex} flexDir="column" gap={4}>
                <Heading size="label.md">Properties</Heading>
                <CodeBlock
                  code={
                    JSON.stringify(
                      data?.metadata.attributes || data?.metadata.properties,
                      null,
                      2,
                    ) || ""
                  }
                  language="json"
                  canCopy={false}
                  wrap={false}
                  overflow="auto"
                />
              </Card>
            ) : null}
          </Flex>
        ),
      },
      {
        title: "Transfer",
        isDisabled: !isOwner,
        children: () => <TransferTab contract={contract} tokenId={tokenId} />,
      },
    ];
    if (erc1155) {
      t = t.concat([
        {
          title: "Airdrop",
          isDisabled: !isOwner,
          children: () => <AirdropTab contract={erc1155} tokenId={tokenId} />,
        },
      ]);
    }
    if (isBurnable) {
      t = t.concat([
        {
          title: "Burn",
          isDisabled: !isOwner,
          children: () => <BurnTab contract={contract} tokenId={tokenId} />,
        },
      ]);
    }
    if (isMintable && erc1155) {
      t = t.concat([
        {
          title: "Mint",
          isDisabled: false,
          children: () => (
            <MintSupplyTab contract={erc1155} tokenId={tokenId} />
          ),
        },
      ]);
    }
    if (isClaimable && isERC1155) {
      t = t.concat([
        {
          title: "Claim Conditions",
          isDisabled: false,
          children: () => (
            <ClaimConditions contract={contract} tokenId={tokenId} isColumn />
          ),
        },
      ]);
    }
    return t;
  }, [
    contract,
    isBurnable,
    isERC1155,
    isERC721,
    isMintable,
    isOwner,
    renderData,
    tokenId,
    erc1155,
    isClaimable,
    data,
  ]);

  if (!renderData) {
    return null;
  }

  return (
    <Drawer
      allowPinchZoom
      preserveScrollBarGap
      size="lg"
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

        <Tabs isLazy lazyBehavior="keepMounted">
          <TabList
            px={0}
            borderBottomColor="borderColor"
            borderBottomWidth="1px"
            overflowX={{ base: "auto", md: "inherit" }}
          >
            {tabs.map((tab) => (
              <Tab key={tab.title} gap={2} isDisabled={tab.isDisabled}>
                {tab.title}
              </Tab>
            ))}
          </TabList>
          <TabPanels px={0} py={2}>
            {tabs.map((tab) => {
              return (
                <TabPanel key={tab.title} px={0}>
                  {tab.children()}
                </TabPanel>
              );
            })}
          </TabPanels>
        </Tabs>
      </Flex>
    </Drawer>
  );
};
