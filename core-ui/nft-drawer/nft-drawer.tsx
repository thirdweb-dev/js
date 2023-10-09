import { NFTDrawerTab } from "./types";
import {
  Flex,
  GridItem,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  usePrevious,
} from "@chakra-ui/react";
import type { NFT } from "@thirdweb-dev/sdk";
import { BigNumber } from "ethers";
import React from "react";
import { Badge, Card, CodeBlock, Drawer, Heading, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";

interface NFTDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: NFT | null;
  tabs: NFTDrawerTab[];
}

export const NFTDrawer: React.FC<NFTDrawerProps> = ({
  isOpen,
  onClose,
  data,
  tabs,
}) => {
  const prevData = usePrevious(data);

  const renderData = data || prevData;

  if (!renderData) {
    return null;
  }

  const tokenId = renderData.metadata.id;
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
          <NFTMediaWithEmptyState
            metadata={renderData.metadata}
            requireInteraction
            width="150px"
            height="150px"
          />
          <Flex flexDir="column" gap={2} w="70%">
            <Heading size="title.lg">{renderData.metadata.name}</Heading>
            <Text size="label.md" noOfLines={6}>
              {renderData.metadata.description}
            </Text>
          </Flex>
        </Flex>

        <Tabs isLazy lazyBehavior="keepMounted" colorScheme="gray">
          <TabList
            px={0}
            borderBottomColor="borderColor"
            borderBottomWidth="1px"
            overflowX={{ base: "auto", md: "inherit" }}
          >
            <Tab gap={2}>Details</Tab>
            {tabs.map((tab) => (
              <Tab key={tab.title} gap={2} isDisabled={tab.isDisabled}>
                {tab.title}
              </Tab>
            ))}
          </TabList>
          <TabPanels px={0} py={2}>
            {/* details tab always exists! */}
            <TabPanel px={0}>
              <Flex flexDir="column" gap={4}>
                <Card as={Flex} flexDir="column" gap={3}>
                  <SimpleGrid rowGap={3} columns={12} placeItems="center left">
                    <GridItem colSpan={3}>
                      <Heading size="label.md">Token ID</Heading>
                    </GridItem>
                    <GridItem colSpan={9}>
                      <AddressCopyButton size="xs" address={tokenId} tokenId />
                    </GridItem>

                    {renderData.type !== "ERC1155" &&
                      BigNumber.from(renderData.supply).lt(2) && (
                        <>
                          <GridItem colSpan={3}>
                            <Heading size="label.md">Owner</Heading>
                          </GridItem>
                          <GridItem colSpan={9}>
                            <AddressCopyButton
                              size="xs"
                              address={renderData.owner}
                            />
                          </GridItem>
                        </>
                      )}
                    <GridItem colSpan={3}>
                      <Heading size="label.md">Token Standard</Heading>
                    </GridItem>
                    <GridItem colSpan={9}>
                      <Badge size="label.sm" variant="subtle">
                        {renderData.type}
                      </Badge>
                    </GridItem>
                    {renderData.type !== "ERC721" && (
                      <>
                        <GridItem colSpan={3}>
                          <Heading size="label.md">Supply</Heading>
                        </GridItem>
                        <GridItem colSpan={9}>
                          <Text fontFamily="mono" size="body.md">
                            {renderData.supply}
                          </Text>
                        </GridItem>
                      </>
                    )}
                  </SimpleGrid>
                </Card>
                {renderData.metadata.attributes ||
                renderData.metadata.properties ? (
                  <Card as={Flex} flexDir="column" gap={4}>
                    <Heading size="label.md">Properties</Heading>
                    <CodeBlock
                      code={
                        JSON.stringify(
                          renderData.metadata.attributes ||
                            renderData.metadata.properties,
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
            </TabPanel>
            {tabs.map((tab) => {
              return (
                <TabPanel key={tab.title} px={0}>
                  {tab.children}
                </TabPanel>
              );
            })}
          </TabPanels>
        </Tabs>
      </Flex>
    </Drawer>
  );
};
