import { MinterOnly, useEditionDropContractMetadata } from "@3rdweb-sdk/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { Icon } from "@chakra-ui/react";
import { useEditionDrop } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { EditionDropBatchUpload } from "components/batch-upload/EditionDropBatchUpload";
import { MintButton } from "components/contract-pages/action-buttons/MintButton";
import { ContractLayout } from "components/contract-pages/contract-layout";
import { ContractItemsTable } from "components/contract-pages/table";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import React, { ReactElement } from "react";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";
import { Button } from "tw-components";

export default function EditionDropPage() {
  const {
    isOpen: isBatchOpen,
    onOpen: onBatchOpen,
    onClose: onBatchClose,
  } = useDisclosure();

  const editionDropAddress = useSingleQueryParam("edition-drop");
  const contract = useEditionDrop(editionDropAddress);
  const metadata = useEditionDropContractMetadata(editionDropAddress);
  const { Track } = useTrack({
    page: "bundle-drop",
    drop: editionDropAddress,
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
        primaryAction={<MintButton colorScheme="primary" contract={contract} />}
        secondaryAction={
          <MinterOnly contract={contract}>
            <Button
              leftIcon={<Icon as={RiCheckboxMultipleBlankLine} />}
              onClick={onBatchOpen}
              colorScheme="primary"
              variant="outline"
            >
              Batch Upload
            </Button>
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
}

EditionDropPage.getLayout = (page: ReactElement) => (
  <AppLayout>{page}</AppLayout>
);
