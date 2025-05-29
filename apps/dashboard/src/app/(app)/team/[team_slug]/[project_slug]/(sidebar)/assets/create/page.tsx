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
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getAuthToken,
  getAuthTokenWalletAddress,
} from "../../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../../login/loginRedirect";
import { CreateTokenAssetPage } from "./create-token-page-impl";

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
      `/team/${params.team_slug}/${params.project_slug}/assets/create`,
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
      <PageHeader
        teamSlug={params.team_slug}
        projectSlug={params.project_slug}
      />
      <div className="container max-w-5xl pt-8 pb-32">
        <CreateTokenAssetPage
          teamSlug={params.team_slug}
          projectSlug={params.project_slug}
          accountAddress={accountAddress}
          client={client}
          teamId={team.id}
          projectId={project.id}
        />
      </div>
    </div>
  );
}

function PageHeader(props: {
  teamSlug: string;
  projectSlug: string;
}) {
  return (
    <div className="border-b">
      <div className="border-b py-3">
        <Breadcrumb className="container max-w-5xl">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/team/${props.teamSlug}/${props.projectSlug}/assets`}
                >
                  Assets
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Token</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container flex max-w-5xl flex-col gap-3 py-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight lg:text-3xl">
            Create Token
          </h1>
          <p className="text-muted-foreground">
            Launch an ERC-20 token for your project
          </p>
        </div>
      </div>
    </div>
  );
}
