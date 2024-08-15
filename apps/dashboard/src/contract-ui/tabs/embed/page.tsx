import { Flex } from "@chakra-ui/react";
import { getErcs, useContract, useContractType } from "@thirdweb-dev/react";
import { detectFeatures } from "components/contract-components/utils";
import { thirdwebClient } from "lib/thirdweb-client";
import { useV5DashboardChain } from "lib/v5-adapter";
import { getContract } from "thirdweb";
import { EmbedSetup } from "./components/embed-setup";

interface ContractEmbedPageProps {
  contractAddress?: string;
}

export const ContractEmbedPage: React.FC<ContractEmbedPageProps> = ({
  contractAddress,
}) => {
  const contractQuery = useContract(contractAddress);
  const { data: contractType } = useContractType(contractAddress);

  const { erc20, erc1155, erc721 } = getErcs(contractQuery?.contract);

  const isMarketplaceV3 = detectFeatures(contractQuery?.contract, [
    "DirectListings",
    "EnglishAuctions",
  ]);

  const ercOrMarketplace =
    contractType === "marketplace"
      ? "marketplace"
      : isMarketplaceV3
        ? "marketplace-v3"
        : erc20
          ? "erc20"
          : erc1155
            ? "erc1155"
            : erc721
              ? "erc721"
              : null;

  const chain = useV5DashboardChain(contractQuery.contract?.chainId);

  if (contractQuery.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (!contractQuery.contract || !chain) {
    return null;
  }

  const contract = getContract({
    address: contractQuery.contract.getAddress(),
    chain,
    client: thirdwebClient,
  });

  return (
    <Flex direction="column" gap={6}>
      {contractQuery?.contract && ercOrMarketplace && (
        <EmbedSetup contract={contract} ercOrMarketplace={ercOrMarketplace} />
      )}
    </Flex>
  );
};
