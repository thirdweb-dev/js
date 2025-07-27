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

export function DirectListingsTable(props: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
  cta: React.ReactNode;
}) {
  const [queryParams, setQueryParams] = useState({ count: 50, start: 0 });
  const getAllQueryResult = useReadContract(getAllListings, {
    contract: props.contract,
    count: BigInt(queryParams.count),
    start: queryParams.start,
  });

  const getValidQueryResult = useReadContract(getAllValidListings, {
    contract: props.contract,
    count: BigInt(queryParams.count),
    start: queryParams.start,
  });
  const totalCountQuery = useReadContract(totalListings, {
    contract: props.contract,
  });

  return (
    <MarketplaceTable
      contract={props.contract}
      getAllQueryResult={getAllQueryResult}
      getValidQueryResult={getValidQueryResult}
      isLoggedIn={props.isLoggedIn}
      queryParams={queryParams}
      setQueryParams={setQueryParams}
      totalCountQuery={totalCountQuery}
      cta={props.cta}
      title="Direct Listings"
    />
  );
}
