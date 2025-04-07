"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type { ThirdwebContract } from "thirdweb";
import { CreateListingButton } from "../components/list-button";
import { DirectListingsTable } from "./components/table";

interface ContractDirectListingsPageProps {
  contract: ThirdwebContract;
  twAccount: Account | undefined;
  isInsightSupported: boolean;
}

export const ContractDirectListingsPage: React.FC<
  ContractDirectListingsPageProps
> = ({ contract, twAccount, isInsightSupported }) => {
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
            twAccount={twAccount}
          />
        </div>
      </div>

      <DirectListingsTable contract={contract} twAccount={twAccount} />
    </div>
  );
};
