import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useMultiChainRegContractList } from "@3rdweb-sdk/react/hooks/useRegistry";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { defineChain, getContract } from "thirdweb";
import { getCompilerMetadata } from "thirdweb/contract";
import { thirdwebClient } from "../../../@/constants/client";
import { FactoryContracts } from "./factory-contracts";

const useFactories = () => {
  const { user, isLoggedIn } = useLoggedInUser();

  const contractListQuery = useMultiChainRegContractList(user?.address);

  return useQuery({
    queryKey: [
      "dashboard-registry",
      user?.address,
      "multichain-contract-list",
      "factories",
    ],
    queryFn: async () => {
      const factories = await Promise.all(
        (contractListQuery.data || []).map(async (c) => {
          const contract = getContract({
            // eslint-disable-next-line no-restricted-syntax
            chain: defineChain(c.chainId),
            address: c.address,
            client: thirdwebClient,
          });
          const m = await getCompilerMetadata(contract);
          return m.name.indexOf("AccountFactory") > -1 ? c : null;
        }),
      );

      return factories.filter((f) => f !== null);
    },
    enabled: !!user?.address && isLoggedIn && !!contractListQuery.data?.length,
  });
};

interface AccountFactoriesProps {
  trackingCategory: string;
}

export const AccountFactories: React.FC<AccountFactoriesProps> = ({
  trackingCategory,
}) => {
  const factories = useFactories();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-8 lg:justify-between lg:items-center">
        <p className="text-muted-foreground text-sm">
          Click an account factory contract to view analytics and accounts
          created.
        </p>

        <Button variant="outline" asChild size="sm">
          <TrackedLinkTW
            category={trackingCategory}
            label="create-factory"
            href="/explore/smart-wallet"
            className="gap-2 text-sm"
          >
            <PlusIcon className="size-3" />
            Deploy Account Factory
          </TrackedLinkTW>
        </Button>
      </div>

      <FactoryContracts
        contracts={factories.data || []}
        isLoading={factories.isLoading}
        isFetched={factories.isFetched}
      />
    </div>
  );
};
