import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useQuery } from "@tanstack/react-query";
import type { BasicContract } from "contract-ui/types/types";
import { useSupportedChains } from "hooks/chains/configureChains";
import { getDashboardChainRpc } from "lib/rpc";
import { getThirdwebSDK } from "lib/sdk";
import { PlusIcon } from "lucide-react";
import { polygon } from "thirdweb/chains";
import invariant from "tiny-invariant";
import { FactoryContracts } from "./factory-contracts";

const useFactories = () => {
  const { user, isLoggedIn } = useLoggedInUser();
  const configuredChains = useSupportedChains();
  return useQuery({
    queryKey: [
      "dashboard-registry",
      user?.address,
      "multichain-contract-list",
      "factories",
    ],
    queryFn: async () => {
      invariant(user?.address, "user should be logged in");
      const polygonSDK = getThirdwebSDK(
        polygon.id,
        getDashboardChainRpc(polygon.id, undefined),
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

    enabled: !!user?.address && isLoggedIn,
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
        contracts={(factories.data || []) as BasicContract[]}
        isLoading={factories.isLoading}
        isFetched={factories.isFetched}
      />
    </div>
  );
};
