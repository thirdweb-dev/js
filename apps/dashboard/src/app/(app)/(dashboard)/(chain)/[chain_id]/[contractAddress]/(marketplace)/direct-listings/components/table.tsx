"use client";

import { useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import {
  getAllListings,
  getAllValidListings,
  totalListings,
} from "thirdweb/extensions/marketplace";
import { useReadContract } from "thirdweb/react";
import { MarketplaceTable } from "../../components/marketplace-table";

interface DirectListingsTableProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

const DEFAULT_QUERY_STATE = { count: 50, start: 0 };

export const DirectListingsTable: React.FC<DirectListingsTableProps> = ({
  contract,
  isLoggedIn,
}) => {
  const [queryParams, setQueryParams] = useState(DEFAULT_QUERY_STATE);
  const getAllQueryResult = useReadContract(getAllListings, {
    contract,
    count: BigInt(queryParams.count),
    start: queryParams.start,
  });
  const getValidQueryResult = useReadContract(getAllValidListings, {
    contract,
    count: BigInt(queryParams.count),
    start: queryParams.start,
  });
  const totalCountQuery = useReadContract(totalListings, { contract });

  return (
    <MarketplaceTable
      contract={contract}
      getAllQueryResult={getAllQueryResult}
      getValidQueryResult={getValidQueryResult}
      isLoggedIn={isLoggedIn}
      queryParams={queryParams}
      setQueryParams={setQueryParams}
      totalCountQuery={totalCountQuery}
    />
  );
};
