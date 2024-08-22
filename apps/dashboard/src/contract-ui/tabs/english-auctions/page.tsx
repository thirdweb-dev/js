import { Flex } from "@chakra-ui/react";
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
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Contract Auctions</Heading>
        <Flex gap={4}>
          <CreateListingButton
            contract={contract}
            type="english-auctions"
            createText="Create English Auction"
          />
        </Flex>
      </Flex>

      <EnglishAuctionsTable contract={contract} />
    </Flex>
  );
};
