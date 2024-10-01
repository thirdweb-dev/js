"use client";

import type { ThirdwebContract } from "thirdweb";
import { Heading } from "tw-components";
import { CreateListingButton } from "../shared-components/list-button";
import { DirectListingsTable } from "./components/table";

interface ContractDirectListingsPageProps {
  contract: ThirdwebContract;
}

export const ContractDirectListingsPage: React.FC<
  ContractDirectListingsPageProps
> = ({ contract }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-between">
        <Heading size="title.sm">Contract Listings</Heading>
        <div className="flex flex-row gap-4">
          <CreateListingButton
            contract={contract}
            type="direct-listings"
            createText="Create Direct Listing"
          />
        </div>
      </div>

      <DirectListingsTable contract={contract} />
    </div>
  );
};
