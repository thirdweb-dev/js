import { ContractWithMetadata, useSupportedChains } from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { getDashboardChainRpc } from "lib/rpc";
import { getEVMThirdwebSDK } from "lib/sdk";
import invariant from "tiny-invariant";
import { useQuery } from "@tanstack/react-query";
import { Flex, Spinner } from "@chakra-ui/react";
import { Heading, TrackedLinkButton, Text } from "tw-components";
import { FiPlus } from "react-icons/fi";
import { FactoryContracts } from "./factory-contracts";

const useFactories = () => {
  const { user, isLoggedIn } = useLoggedInUser();
  const configuredChains = useSupportedChains();
  return useQuery(
    [
      "dashboard-registry",
      user?.address,
      "multichain-contract-list",
      "factories",
    ],
    async () => {
      invariant(user?.address, "user should be logged in");
      const polygonSDK = getEVMThirdwebSDK(
        Polygon.chainId,
        getDashboardChainRpc(Polygon),
      );
      const contractList = await polygonSDK.getMultichainContractList(
        user.address,
        configuredChains,
      );

      const contractWithExtensions = await Promise.all(
        contractList.map(async (c) => {
          const extensions =
            "extensions" in c ? await c.extensions().catch(() => []) : [];
          return extensions.includes("AccountFactory") ? c : null;
        }),
      );

      return contractWithExtensions.filter((f) => f !== null);
    },
    {
      enabled: !!user?.address && isLoggedIn,
    },
  );
};

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
          contracts={(factories.data || []) as ContractWithMetadata[]}
          isLoading={factories.isLoading}
          isFetched={factories.isFetched}
        />
      )}
    </Flex>
  );
};
