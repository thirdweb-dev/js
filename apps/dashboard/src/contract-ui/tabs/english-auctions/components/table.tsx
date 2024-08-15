import { MarketplaceTable } from "contract-ui/tabs/shared-components/marketplace-table";
import { useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import {
  getAllAuctions,
  getAllValidAuctions,
  totalAuctions,
} from "thirdweb/extensions/marketplace";
import { useReadContract } from "thirdweb/react";

interface EnglishAuctionsTableProps {
  contract: ThirdwebContract;
}

const DEFAULT_QUERY_STATE = { count: 50, start: 0 };

export const EnglishAuctionsTable: React.FC<EnglishAuctionsTableProps> = ({
  contract,
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
      totalCountQuery={totalCountQuery}
      queryParams={queryParams}
      setQueryParams={setQueryParams}
      type="english-auctions"
    />
  );
};
