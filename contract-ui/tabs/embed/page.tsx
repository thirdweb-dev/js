import { EmbedSetup } from "./components/embed-setup";
import { Flex } from "@chakra-ui/react";
import { getErcs, useContract, useContractType } from "@thirdweb-dev/react";

interface CustomContractEmbedPageProps {
  contractAddress?: string;
}

export const CustomContractEmbedPage: React.FC<
  CustomContractEmbedPageProps
> = ({ contractAddress }) => {
  const contractQuery = useContract(contractAddress);
  const { data: contractType } = useContractType(contractAddress);

  const { erc20, erc1155, erc721 } = getErcs(contractQuery?.contract);

  const ercOrMarketplace =
    contractType === "marketplace"
      ? "marketplace"
      : contractType === "marketplace-v3"
      ? "marketplace-v3"
      : erc20
      ? "erc20"
      : erc1155
      ? "erc1155"
      : erc721
      ? "erc721"
      : null;

  if (contractQuery.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" gap={6}>
      {contractQuery?.contract && ercOrMarketplace && (
        <EmbedSetup
          contract={contractQuery.contract}
          ercOrMarketplace={ercOrMarketplace}
        />
      )}
    </Flex>
  );
};
