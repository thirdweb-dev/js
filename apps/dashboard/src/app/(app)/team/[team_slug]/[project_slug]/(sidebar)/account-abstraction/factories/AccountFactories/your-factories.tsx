import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { defineChain, getContract, type ThirdwebClient } from "thirdweb";
import { getCompilerMetadata } from "thirdweb/contract";
import { getFilteredProjectContracts } from "@/api/project/getSortedDeployedContracts";
import { ClientOnly } from "@/components/blocks/client-only";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { Button } from "@/components/ui/button";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { FactoryContracts } from "./factory-contracts";

export function YourFactoriesSection(props: {
  teamId: string;
  projectId: string;
  authToken: string;
  teamSlug: string;
  projectSlug: string;
  clientThirdwebClient: ThirdwebClient;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-semibold text-xl tracking-tight">
            Your Account Factories
          </h3>
          <p className="text-muted-foreground text-sm">
            Deploy your own account factories to create smart wallets.{" "}
          </p>
        </div>

        <Button asChild size="sm" variant="default">
          <Link className="gap-2 text-sm" href="/explore/smart-wallet">
            <PlusIcon className="size-3" />
            Deploy Account Factory
          </Link>
        </Button>
      </div>

      <Suspense fallback={<GenericLoadingPage />}>
        <AsyncYourFactories
          authToken={props.authToken}
          clientThirdwebClient={props.clientThirdwebClient}
          projectId={props.projectId}
          projectSlug={props.projectSlug}
          teamId={props.teamId}
          teamSlug={props.teamSlug}
        />
      </Suspense>
    </div>
  );
}

async function AsyncYourFactories(props: {
  teamId: string;
  projectId: string;
  authToken: string;
  teamSlug: string;
  projectSlug: string;
  clientThirdwebClient: ThirdwebClient;
}) {
  const deployedContracts = await getFilteredProjectContracts({
    authToken: props.authToken,
    type: "non-token-contracts",
    projectId: props.projectId,
    teamId: props.teamId,
  });

  const factories = (
    await Promise.all(
      deployedContracts.map(async (c) => {
        try {
          const contract = getContract({
            address: c.contractAddress,
            // eslint-disable-next-line no-restricted-syntax
            chain: defineChain(Number(c.chainId)),
            client: serverThirdwebClient,
          });
          const m = await getCompilerMetadata(contract);
          return m.name.indexOf("AccountFactory") > -1 ? c : null;
        } catch {
          return null;
        }
      }),
    )
  ).filter((f) => f !== null);

  return (
    <ClientOnly ssr={<GenericLoadingPage />}>
      <FactoryContracts
        client={props.clientThirdwebClient}
        contracts={factories}
        isFetched={true}
        isPending={false}
        projectSlug={props.projectSlug}
        teamSlug={props.teamSlug}
      />
    </ClientOnly>
  );
}
