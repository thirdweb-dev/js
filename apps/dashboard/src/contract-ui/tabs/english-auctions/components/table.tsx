import { MarketplaceTable } from "contract-ui/tabs/shared-components/marketplace-table";
import { thirdwebClient } from "lib/thirdweb-client";
import { useV5DashboardChain } from "lib/v5-adapter";
import { useState } from "react";
import { getContract } from "thirdweb";
import {
  getAllAuctions,
  getAllValidAuctions,
  totalAuctions,
} from "thirdweb/extensions/marketplace";
import { useReadContract } from "thirdweb/react";

interface EnglishAuctionsTableProps {
  contractAddress: string;
  chainId: number;
}

const DEFAULT_QUERY_STATE = { count: 50, start: 0 };

export const EnglishAuctionsTable: React.FC<EnglishAuctionsTableProps> = ({
  contractAddress,
  chainId,
}) => {
  const chain = useV5DashboardChain(chainId);
  const [queryParams, setQueryParams] = useState(DEFAULT_QUERY_STATE);
  const contract = getContract({
    client: thirdwebClient,
    address: contractAddress,
    chain: chain,
  });
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
      contractAddress={contractAddress}
      chainId={chainId}
      getAllQueryResult={getAllQueryResult}
      getValidQueryResult={getValidQueryResult}
      totalCountQuery={totalCountQuery}
      queryParams={queryParams}
      setQueryParams={setQueryParams}
      type="english-auctions"
    />
  );
};
