"use client";

import { useState } from "react";
import type { fetchPublishedContracts } from "../../../../../components/contract-components/fetchPublishedContracts";
import { ShowMoreButton } from "../../../../../components/contract-components/tables/show-more-button";
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

  return (
    <PublishedContractTable
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
