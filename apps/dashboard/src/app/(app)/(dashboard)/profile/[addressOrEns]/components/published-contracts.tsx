"use client";

import { useState } from "react";
import type { fetchPublishedContracts } from "@/api/contract/fetchPublishedContracts";
import { ShowMoreButton } from "@/components/contract-components/tables/show-more-button";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
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
      footer={
        publishedContracts.length > slicedData.length ? (
          <ShowMoreButton
            limit={limit}
            setShowMoreLimit={setShowMoreLimit}
            showMoreLimit={showMoreLimit}
          />
        ) : undefined
      }
      publisherEnsName={publisherEnsName}
    />
  );
};
