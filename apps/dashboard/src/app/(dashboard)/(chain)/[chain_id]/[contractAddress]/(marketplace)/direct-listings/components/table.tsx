"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
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
  twAccount: Account | undefined;
}

const DEFAULT_QUERY_STATE = { count: 50, start: 0 };

export const DirectListingsTable: React.FC<DirectListingsTableProps> = ({
  contract,
  twAccount,
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
      totalCountQuery={totalCountQuery}
      queryParams={queryParams}
      setQueryParams={setQueryParams}
      twAccount={twAccount}
    />
  );
};
