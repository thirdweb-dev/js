import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthToken, getAuthTokenWalletAddress } from "@/api/auth-token";
import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { cn } from "@/lib/utils";
import { loginRedirect } from "@/utils/redirects";
import { CreateMarketplacePage } from "./create-marketplace-page";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;

  const [authToken, team, project, accountAddress] = await Promise.all([
    getAuthToken(),
    getTeamBySlug(params.team_slug),
    getProject(params.team_slug, params.project_slug),
    getAuthTokenWalletAddress(),
  ]);

  if (!authToken || !accountAddress) {
    loginRedirect(
      `/team/${params.team_slug}/${params.project_slug}/tokens/create/token`,
    );
  }

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <div className="flex grow flex-col">
      <CreateMarketplacePageHeader
        containerClassName="container max-w-5xl"
        description="Launch a marketplace for your project to allow users to buy and sell NFTs"
        projectSlug={params.project_slug}
        teamSlug={params.team_slug}
        title="Create Marketplace"
      />
      <div className="container max-w-5xl pt-8 pb-32">
        <CreateMarketplacePage
          client={client}
          projectId={project.id}
          teamId={team.id}
          projectSlug={params.project_slug}
          teamPlan={team.billingPlan}
          teamSlug={params.team_slug}
        />
      </div>
    </div>
  );
}

export function CreateMarketplacePageHeader(props: {
  teamSlug: string;
  projectSlug: string;
  title: string;
  description: string;
  containerClassName: string;
}) {
  return (
    <div className="border-b">
      <div className="border-b border-dashed py-3">
        <Breadcrumb className={props.containerClassName}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/team/${props.teamSlug}/${props.projectSlug}/tokens`}
                >
                  Tokens
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/team/${props.teamSlug}/${props.projectSlug}/tokens/marketplace`}
                >
                  NFT Marketplace
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{props.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div
        className={cn(
          "flex flex-col gap-3 py-8 lg:flex-row lg:items-center lg:justify-between",
          props.containerClassName,
        )}
      >
        <div>
          <h1 className="font-semibold text-2xl tracking-tight lg:text-3xl">
            {props.title}
          </h1>
          <p className="text-muted-foreground">{props.description}</p>
        </div>
      </div>
    </div>
  );
}
