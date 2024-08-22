import { thirdwebClient } from "@/constants/client";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useMultiChainRegContractList } from "@3rdweb-sdk/react/hooks/useRegistry";
import { Flex, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getAllDetectedExtensionNames } from "@thirdweb-dev/sdk";
import type { BasicContract } from "contract-ui/types/types";
import { defineDashboardChain } from "lib/defineDashboardChain";
import { FiPlus } from "react-icons/fi";
import { getContract } from "thirdweb";
import { resolveContractAbi } from "thirdweb/contract";
import invariant from "tiny-invariant";
import { Heading, Text, TrackedLinkButton } from "tw-components";
import { FactoryContracts } from "./factory-contracts";

function useFactories() {
  const { user, isLoggedIn } = useLoggedInUser();
  const multiChainContracts = useMultiChainRegContractList(user?.address);
  return useQuery(
    [
      "dashboard-registry",
      user?.address,
      "multichain-contract-list",
      "factories",
    ],
    async () => {
      invariant(user?.address, "user should be logged in");
      invariant(
        multiChainContracts.data?.length,
        "contracts should be fetched",
      );

      // get abi for each contract
      const contractsWithExtensions = await Promise.all(
        multiChainContracts.data.map(async (basicContract) => {
          // define the contract
          const contract = getContract({
            client: thirdwebClient,
            // needed in this case
            // eslint-disable-next-line no-restricted-syntax
            chain: defineDashboardChain(basicContract.chainId, undefined),
            address: basicContract.address,
          });
          // get the abi
          const abi = await resolveContractAbi(contract);
          // get the extensions based on the abi
          const contractExtensions = getAllDetectedExtensionNames(abi);
          return {
            ...basicContract,
            extensions: contractExtensions,
          };
        }),
      );

      // filter for contracts with AccountFactory extension
      return contractsWithExtensions.filter((c) =>
        c.extensions.includes("AccountFactory"),
      );
    },
    {
      enabled:
        !!user?.address && isLoggedIn && !!multiChainContracts.data?.length,
    },
  );
}

interface AccountFactoriesProps {
  trackingCategory: string;
}

export const AccountFactories: React.FC<AccountFactoriesProps> = ({
  trackingCategory,
}) => {
  const factories = useFactories();
  return (
    <Flex flexDir="column" gap={8}>
      <Flex
        flexDir={{ base: "column", lg: "row" }}
        gap={8}
        justifyContent={"space-between"}
        alignItems={"left"}
      >
        <Flex flexDir={"column"} gap={4}>
          <Heading size="title.md" as="h1">
            Your account factories
          </Heading>
          <Text>
            Click an account factory contract to view analytics and accounts
            created.
          </Text>
        </Flex>

        <TrackedLinkButton
          leftIcon={<FiPlus />}
          category={trackingCategory}
          label="create-factory"
          colorScheme="primary"
          href="/explore/smart-wallet"
        >
          Deploy an Account Factory
        </TrackedLinkButton>
      </Flex>

      {factories.isLoading ? (
        <Spinner />
      ) : (
        <FactoryContracts
          contracts={(factories.data || []) as BasicContract[]}
          isLoading={factories.isLoading}
          isFetched={factories.isFetched}
        />
      )}
    </Flex>
  );
};
