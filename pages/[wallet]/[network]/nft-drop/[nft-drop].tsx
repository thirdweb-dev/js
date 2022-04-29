import {
  MinterOnly,
  useBatchesToReveal,
  useNFTDropContractMetadata,
  useNFTDropSupply,
} from "@3rdweb-sdk/react";
import { useClaimPhases } from "@3rdweb-sdk/react/hooks/useClaimPhases";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Icon,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useNFTDrop } from "@thirdweb-dev/react";
import { BatchToReveal } from "@thirdweb-dev/sdk";
import { AppLayout } from "components/app-layouts/app";
import { NftDropBatchUpload } from "components/batch-upload/NftDropBatchUpload";
import { RevealNftsModal } from "components/batch-upload/RevealNfts";
import { MismatchButton } from "components/buttons/MismatchButton";
import { MintButton } from "components/contract-pages/action-buttons/MintButton";
import { ContractLayout } from "components/contract-pages/contract-layout";
import { ContractItemsTable } from "components/contract-pages/table";
import { ContractPageNotice } from "components/notices/ContractPageNotice";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useRouter } from "next/router";
import { ConsolePage } from "pages/_app";
import React, { useState } from "react";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";
import { Card } from "tw-components";

const NFTDropPage: ConsolePage = () => {
  const {
    isOpen: isBatchOpen,
    onOpen: onBatchOpen,
    onClose: onBatchClose,
  } = useDisclosure();
  const {
    isOpen: isRevealOpen,
    onOpen: onRevealOpen,
    onClose: onRevealClose,
  } = useDisclosure();
  const router = useRouter();
  const [selectedBatch, setSelectedBatch] = useState<BatchToReveal>();

  const dropAddress = useSingleQueryParam("nft-drop");
  const contract = useNFTDrop(dropAddress);
  const claimPhases = useClaimPhases(contract);
  const metadata = useNFTDropContractMetadata(dropAddress);
  const batchesToReveal = useBatchesToReveal(dropAddress);

  const { data: supplyData } = useNFTDropSupply(dropAddress);
  const { Track } = useTrack({
    page: "drop",
    drop: dropAddress,
  });

  return (
    <Track>
      <NftDropBatchUpload
        isOpen={isBatchOpen}
        onClose={onBatchClose}
        contract={contract}
      />
      <RevealNftsModal
        isOpen={isRevealOpen}
        onClose={onRevealClose}
        contract={contract}
        batch={selectedBatch as BatchToReveal}
      />

      <ContractLayout
        contract={contract}
        metadata={metadata}
        primaryAction={<MintButton colorScheme="primary" contract={contract} />}
        secondaryAction={
          <MinterOnly contract={contract}>
            <MismatchButton
              leftIcon={<Icon as={RiCheckboxMultipleBlankLine} />}
              onClick={onBatchOpen}
              colorScheme="primary"
              variant="outline"
            >
              Batch Upload
            </MismatchButton>
          </MinterOnly>
        }
        tertiaryAction={
          batchesToReveal.data && batchesToReveal.data.length > 0 ? (
            <MinterOnly contract={contract}>
              {batchesToReveal.data && batchesToReveal.data.length === 1 ? (
                <MismatchButton
                  isDisabled={!batchesToReveal.data}
                  isLoading={batchesToReveal.isLoading}
                  onClick={() => {
                    const batch =
                      batchesToReveal.data && batchesToReveal.data[0];
                    if (batch) {
                      setSelectedBatch(batch);
                      onRevealOpen();
                    }
                  }}
                  colorScheme="blue"
                >
                  Reveal NFTs
                </MismatchButton>
              ) : (
                <Menu>
                  <MismatchButton
                    as={MenuButton}
                    isDisabled={!batchesToReveal.data}
                    isLoading={batchesToReveal.isLoading}
                    colorScheme="blue"
                  >
                    Reveal NFTs
                  </MismatchButton>
                  <MenuList>
                    {batchesToReveal.data.map((batch) => (
                      <MenuItemOption
                        key={batch.batchUri}
                        value={batch.batchId.toString()}
                        onClick={() => {
                          setSelectedBatch(batch);
                          onRevealOpen();
                        }}
                      >
                        {batch.placeholderMetadata.name}
                      </MenuItemOption>
                    ))}
                  </MenuList>
                </Menu>
              )}
            </MinterOnly>
          ) : undefined
        }
        emptyState={{
          title:
            "You have not added any drops yet, let's add your first one to get started!",
        }}
      >
        <Stack spacing={6}>
          {!claimPhases?.data?.length && !claimPhases.isLoading && (
            <ContractPageNotice
              color="orange"
              onClick={() =>
                router.push({ query: { ...router.query, tabIndex: 2 } })
              }
              action="Set Claim Phase"
              message={`
                You need to create a claim phase in order for users to claim your NFTs.
              `}
            />
          )}
          <Stack direction="row" spacing={{ base: 2, md: 6 }}>
            <Card as={Stat}>
              <StatLabel>Total Supply</StatLabel>
              <StatNumber>{supplyData?.totalSupply}</StatNumber>
            </Card>
            <Card as={Stat}>
              <StatLabel>Claimed Supply</StatLabel>
              <StatNumber>{supplyData?.totalClaimedSupply}</StatNumber>
            </Card>
            <Card as={Stat}>
              <StatLabel>Unclaimed Supply</StatLabel>
              <StatNumber>{supplyData?.totalUnclaimedSupply}</StatNumber>
            </Card>
          </Stack>

          <Tabs variant="solid-rounded">
            <TabList>
              <Tab>Unclaimed</Tab>
              <Tab>Claimed</Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                <ContractItemsTable
                  lazyMint
                  contract={contract}
                  emptyState={{
                    title:
                      "You have not added any drops yet, let's add your first one to get started!",
                  }}
                />
              </TabPanel>
              <TabPanel px={0}>
                <ContractItemsTable
                  contract={contract}
                  emptyState={{
                    title: "No one has claimed any of your drops yet!",
                  }}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </ContractLayout>
    </Track>
  );
};

export default NFTDropPage;

NFTDropPage.Layout = AppLayout;
