import { useContractMetadata } from "@3rdweb-sdk/react";
import { useEdition } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { MintButton } from "components/contract-pages/action-buttons/MintButton";
import { ContractLayout } from "components/contract-pages/contract-layout";
import { ContractItemsTable } from "components/contract-pages/table";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import React, { ReactElement } from "react";

export default function EditionPage() {
  const editionAddress = useSingleQueryParam("edition");
  const contract = useEdition(editionAddress);
  const metadata = useContractMetadata(contract);

  const { Track } = useTrack({
    page: "bundle",
    bundle: editionAddress,
  });

  return (
    <Track>
      <ContractLayout
        contract={contract}
        metadata={metadata}
        primaryAction={<MintButton colorScheme="primary" contract={contract} />}
        emptyState={{
          title:
            "You have not minted any NFTs yet, let's mint one to get you started!",
        }}
      >
        <ContractItemsTable
          contract={contract}
          emptyState={{
            title:
              "You have not minted any NFTs yet, let's mint one to get you started!",
          }}
        />
      </ContractLayout>
    </Track>
  );
}

EditionPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;
