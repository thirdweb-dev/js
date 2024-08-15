import { Flex } from "@chakra-ui/react";
import type { ThirdwebContract } from "thirdweb";
import { EmbedSetup } from "./components/embed-setup";

interface ContractEmbedPageProps {
  contract: ThirdwebContract;
  ercOrMarketplace:
    | "marketplace"
    | "marketplace-v3"
    | "erc20"
    | "erc1155"
    | "erc721"
    | null;
}

export const ContractEmbedPage: React.FC<ContractEmbedPageProps> = ({
  contract,
  ercOrMarketplace,
}) => {
  return (
    <Flex direction="column" gap={6}>
      {ercOrMarketplace && (
        <EmbedSetup contract={contract} ercOrMarketplace={ercOrMarketplace} />
      )}
    </Flex>
  );
};
