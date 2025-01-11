"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
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
  twAccount: Account | undefined;
}

const DEFAULT_QUERY_STATE = { count: 50, start: 0 };

export const EnglishAuctionsTable: React.FC<EnglishAuctionsTableProps> = ({
  contract,
  twAccount,
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
      twAccount={twAccount}
      contract={contract}
      getAllQueryResult={getAllQueryResult}
      getValidQueryResult={getValidQueryResult}
      totalCountQuery={totalCountQuery}
      queryParams={queryParams}
      setQueryParams={setQueryParams}
    />
  );
};
