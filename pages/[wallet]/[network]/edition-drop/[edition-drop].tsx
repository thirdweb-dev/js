import { MinterOnly, useBundleDropContractMetadata } from "@3rdweb-sdk/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { Icon } from "@chakra-ui/react";
import { useEditionDrop } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { EditionDropBatchUpload } from "components/batch-upload/EditionDropBatchUpload";
import { MismatchButton } from "components/buttons/MismatchButton";
import { MintButton } from "components/contract-pages/action-buttons/MintButton";
import { ContractLayout } from "components/contract-pages/contract-layout";
import { ContractItemsTable } from "components/contract-pages/table";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { ConsolePage } from "pages/_app";
import React from "react";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";

const LazyNFTListPage: ConsolePage = () => {
  const {
    isOpen: isBatchOpen,
    onOpen: onBatchOpen,
    onClose: onBatchClose,
  } = useDisclosure();

  const bundleDropAddress = useSingleQueryParam("edition-drop");
  const contract = useEditionDrop(bundleDropAddress);
  const metadata = useBundleDropContractMetadata(bundleDropAddress);
  const { Track } = useTrack({
    page: "bundle-drop",
    drop: bundleDropAddress,
  });

  return (
    <Track>
      <EditionDropBatchUpload
        isOpen={isBatchOpen}
        onClose={onBatchClose}
        contract={contract}
      />

      <ContractLayout
        contract={contract}
        metadata={metadata}
        primaryAction={MintButton}
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
        emptyState={{
          title:
            "You have not added any drops yet, let's add your first one to get started!",
        }}
      >
        <ContractItemsTable
          contract={contract}
          emptyState={{
            title:
              "You have not added any drops yet, let's add your first one to get started!",
          }}
        />
      </ContractLayout>
    </Track>
  );
};

export default LazyNFTListPage;

LazyNFTListPage.Layout = AppLayout;
