import { useContractMetadata } from "@3rdweb-sdk/react";
import { useEdition } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { MintButton } from "components/contract-pages/action-buttons/MintButton";
import { ContractLayout } from "components/contract-pages/contract-layout";
import { ContractItemsTable } from "components/contract-pages/table";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { ConsolePage } from "pages/_app";
import React from "react";

const EditionPage: ConsolePage = () => {
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
        primaryAction={MintButton}
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
};

EditionPage.Layout = AppLayout;

export default EditionPage;
