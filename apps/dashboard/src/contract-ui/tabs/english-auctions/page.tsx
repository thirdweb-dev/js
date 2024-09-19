import type { ThirdwebContract } from "thirdweb";
import { Heading } from "tw-components";
import { CreateListingButton } from "../shared-components/list-button";
import { EnglishAuctionsTable } from "./components/table";

interface ContractEnglishAuctionsProps {
  contract: ThirdwebContract;
}

export const ContractEnglishAuctionsPage: React.FC<
  ContractEnglishAuctionsProps
> = ({ contract }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row justify-between items-center">
        <Heading size="title.sm">Contract Auctions</Heading>
        <div className="flex flex-row gap-4">
          <CreateListingButton
            contract={contract}
            type="english-auctions"
            createText="Create English Auction"
          />
        </div>
      </div>

      <EnglishAuctionsTable contract={contract} />
    </div>
  );
};
