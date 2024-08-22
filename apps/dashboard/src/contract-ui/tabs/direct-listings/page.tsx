import { Flex } from "@chakra-ui/react";
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
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Contract Listings</Heading>
        <Flex gap={4}>
          <CreateListingButton
            contract={contract}
            type="direct-listings"
            createText="Create Direct Listing"
          />
        </Flex>
      </Flex>

      <DirectListingsTable contract={contract} />
    </Flex>
  );
};
