"use client";

import type { ThirdwebContract } from "thirdweb";
import { CreateListingButton } from "../components/list-button";
import { DirectListingsTable } from "./components/table";

interface ContractDirectListingsPageProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
  isInsightSupported: boolean;
}

export const ContractDirectListingsPage: React.FC<
  ContractDirectListingsPageProps
> = ({ contract, isLoggedIn, isInsightSupported }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-between">
        <h2 className="font-semibold text-2xl tracking-tight">
          Direct Listings
        </h2>
        <div className="flex flex-row gap-4">
          <CreateListingButton
            isInsightSupported={isInsightSupported}
            contract={contract}
            type="direct-listings"
            createText="Create Direct Listing"
            isLoggedIn={isLoggedIn}
          />
        </div>
      </div>

      <DirectListingsTable contract={contract} isLoggedIn={isLoggedIn} />
    </div>
  );
};
