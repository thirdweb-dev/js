"use client";

import { useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import {
  getAllAuctions,
  getAllValidAuctions,
  totalAuctions,
} from "thirdweb/extensions/marketplace";
import { useReadContract } from "thirdweb/react";
import { MarketplaceTable } from "../../components/marketplace-table";

interface EnglishAuctionsTableProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

const DEFAULT_QUERY_STATE = { count: 50, start: 0 };

export const EnglishAuctionsTable: React.FC<EnglishAuctionsTableProps> = ({
  contract,
  isLoggedIn,
}) => {
  const [queryParams, setQueryParams] = useState(DEFAULT_QUERY_STATE);
  const getAllQueryResult = useReadContract(getAllAuctions, {
    contract,
    count: BigInt(queryParams.count),
    start: queryParams.start,
  });
  const getValidQueryResult = useReadContract(getAllValidAuctions, {
    contract,
    count: BigInt(queryParams.count),
    start: queryParams.start,
  });
  const totalCountQuery = useReadContract(totalAuctions, { contract });

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
