import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { defineChain, getContract } from "thirdweb";
import { getCompilerMetadata } from "thirdweb/contract";
import { ClientOnly } from "../../../../../../../components/ClientOnly/ClientOnly";
import { DefaultFactoriesSection } from "../../../../../../../components/smart-wallets/AccountFactories";
import { FactoryContracts } from "../../../../../../../components/smart-wallets/AccountFactories/factory-contracts";
import { getSortedDeployedContracts } from "../../../../../../account/contracts/_components/getSortedDeployedContracts";
import { getAuthToken } from "../../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../../login/loginRedirect";

const trackingCategory = "smart-wallet";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;

  const [authToken, team, project] = await Promise.all([
    getAuthToken(),
    getTeamBySlug(params.team_slug),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!authToken) {
    loginRedirect(
      `/team/${params.team_slug}/${params.project_slug}/connect/account-abstraction/factories`,
    );
  }

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <DefaultFactoriesSection />
      <YourFactoriesSection
        teamId={team.id}
        projectId={project.id}
        authToken={authToken}
      />
    </div>
  );
}

function YourFactoriesSection(props: {
  teamId: string;
  projectId: string;
  authToken: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-semibold text-xl tracking-tight">
            Your Account Factories
          </h3>
          <p className="text-muted-foreground text-sm">
            Deploy your own account factories to create smart wallets.{" "}
            <UnderlineLink
              href="https://portal.thirdweb.com/connect/account-abstraction/factories"
              target="_blank"
              rel="noreferrer"
            >
              Learn more{" "}
            </UnderlineLink>
          </p>
        </div>

        <Button variant="default" asChild size="sm">
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

      <Suspense fallback={<GenericLoadingPage />}>
        <AsyncYourFactories
          teamId={props.teamId}
          projectId={props.projectId}
          authToken={props.authToken}
        />
      </Suspense>
    </div>
  );
}

async function AsyncYourFactories(props: {
  teamId: string;
  projectId: string;
  authToken: string;
}) {
  const deployedContracts = await getSortedDeployedContracts({
    teamId: props.teamId,
    projectId: props.projectId,
    authToken: props.authToken,
  });

  const client = getThirdwebClient({
    jwt: props.authToken,
    teamId: props.teamId,
  });

  const factories = (
    await Promise.all(
      deployedContracts.map(async (c) => {
        try {
          const contract = getContract({
            // eslint-disable-next-line no-restricted-syntax
            chain: defineChain(Number(c.chainId)),
            address: c.contractAddress,
            client,
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
        contracts={factories}
        isPending={false}
        isFetched={true}
      />
    </ClientOnly>
  );
}
