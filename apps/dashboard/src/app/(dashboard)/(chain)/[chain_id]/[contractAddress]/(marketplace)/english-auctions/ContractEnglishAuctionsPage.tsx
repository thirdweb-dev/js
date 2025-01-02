"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type { ThirdwebContract } from "thirdweb";
import { CreateListingButton } from "../components/list-button";
import { EnglishAuctionsTable } from "./components/table";

interface ContractEnglishAuctionsProps {
  contract: ThirdwebContract;
  twAccount: Account | undefined;
}

export const ContractEnglishAuctionsPage: React.FC<
  ContractEnglishAuctionsProps
> = ({ contract, twAccount }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-between">
        <p className="text-lg">Contract Auctions</p>
        <div className="flex flex-row gap-4">
          <CreateListingButton
            contract={contract}
            type="english-auctions"
            createText="Create English Auction"
            twAccount={twAccount}
          />
        </div>
      </div>

      <EnglishAuctionsTable contract={contract} twAccount={twAccount} />
    </div>
  );
};
