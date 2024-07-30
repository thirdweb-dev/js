import { MarketplaceTable } from "contract-ui/tabs/shared-components/marketplace-table";
import { useState } from "react";
import { getContract } from "thirdweb";
import {
  getAllListings,
  getAllValidListings,
  totalListings,
} from "thirdweb/extensions/marketplace";
import { useReadContract } from "thirdweb/react";
import { thirdwebClient } from "../../../../lib/thirdweb-client";
import { defineDashboardChain } from "../../../../lib/v5-adapter";

interface DirectListingsTableProps {
  contractAddress: string;
  chainId: number;
}

const DEFAULT_QUERY_STATE = { count: 50, start: 0 };

export const DirectListingsTable: React.FC<DirectListingsTableProps> = ({
  contractAddress,
  chainId,
}) => {
  const contract = getContract({
    client: thirdwebClient,
    address: contractAddress,
    chain: defineDashboardChain(chainId),
  });
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
      contractAddress={contractAddress}
      chainId={chainId}
      getAllQueryResult={getAllQueryResult}
      getValidQueryResult={getValidQueryResult}
      totalCountQuery={totalCountQuery}
      queryParams={queryParams}
      setQueryParams={setQueryParams}
      type="direct-listings"
    />
  );
};
