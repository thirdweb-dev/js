import {
  useDirectListings,
  useDirectListingsCount,
  useValidDirectListings,
} from "@thirdweb-dev/react";
import { MarketplaceV3 } from "@thirdweb-dev/sdk";
import { MarketplaceTable } from "contract-ui/tabs/shared-components/marketplace-table";
import { useState } from "react";

interface DirectListingsTableProps {
  contract: MarketplaceV3;
}

const DEFAULT_QUERY_STATE = { count: 50, start: 0 };

export const DirectListingsTable: React.FC<DirectListingsTableProps> = ({
  contract,
}) => {
  const [queryParams, setQueryParams] = useState(DEFAULT_QUERY_STATE);
  const getAllQueryResult = useDirectListings(contract, queryParams);
  const getValidQueryResult = useValidDirectListings(contract, queryParams);
  const totalCountQuery = useDirectListingsCount(contract);

  return (
    <MarketplaceTable
      contract={contract}
      getAllQueryResult={getAllQueryResult}
      getValidQueryResult={getValidQueryResult}
      totalCountQuery={totalCountQuery}
      queryParams={queryParams}
      setQueryParams={setQueryParams}
      type="direct-listings"
    />
  );
};
