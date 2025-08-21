import { getValidAccount } from "@/api/account/get-account";
import { getAuthToken } from "@/api/auth-token";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import type { EngineInstance } from "@/hooks/useEngine";
import { loginRedirect } from "@/utils/redirects";
import { getEngineInstance } from "../../_utils/getEngineInstance";
import { EngineErrorPage } from "./_components/EngineErrorPage";
import { EngineSidebarLayout } from "./_components/EnginePageLayout";
import { EnsureEnginePermission } from "./_components/EnsureEnginePermission";
import { EngineVersionBadge } from "./_components/version";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
    engineId: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const account = await getValidAccount();
  const authToken = await getAuthToken();

  if (!authToken) {
    loginRedirect(
      `/team/${params.team_slug}/${params.project_slug}/engine/${params.engineId}`,
    );
  }

  const instance = await getEngineInstance({
    accountId: account.id,
    authToken,
    engineId: params.engineId,
    teamIdOrSlug: params.team_slug,
  });

  const engineRootLayoutPath = `/team/${params.team_slug}/${params.project_slug}/engine`;

  if (!instance) {
    return (
      <EngineSidebarLayout
        engineId={params.engineId}
        projectSlug={params.project_slug}
        teamSlug={params.team_slug}
      >
        <EngineErrorPage rootPath={engineRootLayoutPath}>
          Engine Instance Not Found
        </EngineErrorPage>
      </EngineSidebarLayout>
    );
  }

  return (
    <div className="flex grow flex-col">
      <EngineInstanceHeader
        instance={instance}
        rootPath={engineRootLayoutPath}
        teamSlug={params.team_slug}
      />

      <EngineSidebarLayout
        engineId={params.engineId}
        projectSlug={params.project_slug}
        teamSlug={params.team_slug}
      >
        <EnsureEnginePermission
          accountId={account.id}
          authToken={authToken}
          engineId={params.engineId}
          instance={instance}
          projectSlug={params.project_slug}
          teamSlug={params.team_slug}
        >
          <div>{props.children}</div>
        </EnsureEnginePermission>
      </EngineSidebarLayout>
    </div>
  );
}

function EngineInstanceHeader(props: {
  instance: EngineInstance;
  rootPath: string;
  teamSlug: string;
}) {
  const { instance } = props;
  const cleanEngineURL = instance.url.endsWith("/")
    ? instance.url.slice(0, -1)
    : instance.url;

  return (
    <div className="border-border border-b">
      <div className="container py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={props.rootPath}>Engines</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>

        <div className="h-4" />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* left */}
          <div>
            <h1 className="font-semibold text-3xl tracking-tight">
              {instance.name}
            </h1>
            {!instance.name.startsWith("https://") && (
              <CopyTextButton
                className="-translate-x-2 h-auto px-2 py-1 text-muted-foreground"
                copyIconPosition="right"
                iconClassName="size-2.5"
                textToCopy={cleanEngineURL}
                textToShow={cleanEngineURL}
                tooltip="Copy Engine URL"
                variant="ghost"
              />
            )}
          </div>

          {/* Right */}
          <EngineVersionBadge instance={instance} teamSlug={props.teamSlug} />
        </div>
      </div>
    </div>
  );
}
