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
import { useMemo } from "react";
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

  const isERC1155 = contract instanceof Erc1155;
  const isERC721 = contract instanceof Erc721;
  const isOwner =
    (isERC1155 && BigNumber.from(balanceOf?.data || 0).gt(0)) ||
    (isERC721 && renderData?.owner === address);

  const isBurnable = detectBurnable(contract);
  const isMintable = detectMintable(contract);
  const isClaimable = detectClaimable(contract);

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
          <Card as={Flex} flexDir="column" gap={3}>
            <Text size="label.md">Token ID: {tokenId}</Text>
            {isERC721 && <Text size="label.md">Owner: {renderData.owner}</Text>}
            <Text size="label.md">Token Standard: {renderData.type}</Text>
            {isERC1155 && (
              <Text size="label.md">
                Supply: {renderData.supply.toString()}
              </Text>
            )}
          </Card>
        ),
      },
      {
        title: "Transfer",
        isDisabled: !isOwner,
        children: () => <TransferTab contract={contract} tokenId={tokenId} />,
      },
    ];
    if (isERC1155) {
      t = t.concat([
        {
          title: "Airdrop",
          isDisabled: !isOwner,
          children: () => <AirdropTab contract={contract} tokenId={tokenId} />,
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
    if (isMintable && isERC1155) {
      t = t.concat([
        {
          title: "Mint",
          isDisabled: false,
          children: () => (
            <MintSupplyTab contract={contract} tokenId={tokenId} />
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
    isClaimable,
    isERC1155,
    isERC721,
    isMintable,
    isOwner,
    renderData,
    tokenId,
  ]);

  if (!renderData) {
    return null;
  }

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
