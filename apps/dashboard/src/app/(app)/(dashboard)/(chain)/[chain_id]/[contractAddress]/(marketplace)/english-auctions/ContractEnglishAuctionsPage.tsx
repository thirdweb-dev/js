"use client";

import type { ThirdwebContract } from "thirdweb";
import { CreateListingButton } from "../components/list-button";
import { EnglishAuctionsTable } from "./components/table";

interface ContractEnglishAuctionsProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
  isInsightSupported: boolean;
}

export const ContractEnglishAuctionsPage: React.FC<
  ContractEnglishAuctionsProps
> = ({ contract, isLoggedIn, isInsightSupported }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-between">
        <h2 className="font-semibold text-2xl tracking-tight">
          English Auctions
        </h2>
        <div className="flex flex-row gap-4">
          <CreateListingButton
            contract={contract}
            type="english-auctions"
            createText="Create English Auction"
            isLoggedIn={isLoggedIn}
            isInsightSupported={isInsightSupported}
          />
        </div>
      </div>

      <EnglishAuctionsTable contract={contract} isLoggedIn={isLoggedIn} />
    </div>
  );
};
