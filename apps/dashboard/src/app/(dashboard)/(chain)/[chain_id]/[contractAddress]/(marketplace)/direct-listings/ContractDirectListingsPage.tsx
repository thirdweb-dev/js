"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type { ThirdwebContract } from "thirdweb";
import { CreateListingButton } from "../components/list-button";
import { DirectListingsTable } from "./components/table";

interface ContractDirectListingsPageProps {
  contract: ThirdwebContract;
  twAccount: Account | undefined;
}

export const ContractDirectListingsPage: React.FC<
  ContractDirectListingsPageProps
> = ({ contract, twAccount }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-between">
        <p className="text-lg">Contract Listings</p>
        <div className="flex flex-row gap-4">
          <CreateListingButton
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
