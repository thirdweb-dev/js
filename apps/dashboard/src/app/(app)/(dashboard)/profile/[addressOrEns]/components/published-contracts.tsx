"use client";

import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import type { fetchPublishedContracts } from "components/contract-components/fetchPublishedContracts";
import { ShowMoreButton } from "components/contract-components/tables/show-more-button";
import { useState } from "react";
import { PublishedContractTable } from "./PublishedContractTable";

interface PublishedContractsProps {
  limit?: number;
  publishedContracts: Awaited<ReturnType<typeof fetchPublishedContracts>>;
  publisherEnsName: string | undefined;
}

export const PublishedContracts: React.FC<PublishedContractsProps> = ({
  limit = 10,
  publishedContracts,
  publisherEnsName,
}) => {
  const [showMoreLimit, setShowMoreLimit] = useState(10);
  const slicedData = publishedContracts.slice(0, showMoreLimit);
  const client = getClientThirdwebClient(undefined);

  return (
    <PublishedContractTable
      client={client}
      contractDetails={slicedData}
      publisherEnsName={publisherEnsName}
      footer={
        publishedContracts.length > slicedData.length ? (
          <ShowMoreButton
            limit={limit}
            showMoreLimit={showMoreLimit}
            setShowMoreLimit={setShowMoreLimit}
          />
        ) : undefined
      }
    />
  );
};
