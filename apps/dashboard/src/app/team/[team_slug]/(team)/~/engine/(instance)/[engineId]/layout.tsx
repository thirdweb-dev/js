import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { getValidAccount } from "../../../../../../../account/settings/getAccount";
import { getAuthToken } from "../../../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../../../login/loginRedirect";
import { getEngineAccessPermission } from "../../_utils/getEngineAccessPermission";
import { getEngineInstance } from "../../_utils/getEngineInstance";
import { EngineErrorPage } from "./_components/EngineErrorPage";
import { EngineSidebarLayout } from "./_components/EnginePageLayout";
import { EngineVersionBadge } from "./_components/version";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
    engineId: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const account = await getValidAccount();
  const authToken = await getAuthToken();

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/~/engine/${params.engineId}`);
  }

  const instance = await getEngineInstance({
    authToken,
    engineId: params.engineId,
    accountId: account.id,
  });

  const engineRootLayoutPath = `/team/${params.team_slug}/~/engine`;

  if (!instance) {
    return (
      <EngineSidebarLayout
        engineId={params.engineId}
        teamSlug={params.team_slug}
      >
        <EngineErrorPage rootPath={engineRootLayoutPath}>
          Engine Instance Not Found
        </EngineErrorPage>
      </EngineSidebarLayout>
    );
  }

  const permission = await getEngineAccessPermission({
    authToken,
    instanceUrl: instance.url,
  });

  return (
    <EngineSidebarLayout engineId={params.engineId} teamSlug={params.team_slug}>
      <EngineInstanceLayoutContent
        instance={instance}
        permission={permission}
        rootPath={engineRootLayoutPath}
        team_slug={params.team_slug}
      >
        {props.children}
      </EngineInstanceLayoutContent>
    </EngineSidebarLayout>
  );
}

function EngineInstanceLayoutContent(props: {
  permission: {
    ok: boolean;
    status: number;
  };
  instance: EngineInstance;
  rootPath: string;
  children: React.ReactNode;
  team_slug: string;
}) {
  const { instance, permission, rootPath, team_slug } = props;

  if (!permission.ok) {
    if (permission.status === 404) {
      return (
        <EngineErrorPage rootPath={rootPath}>
          <p> Engine Instance Not Found </p>
        </EngineErrorPage>
      );
    }

    if (permission.status === 500) {
      return (
        <EngineErrorPage rootPath={rootPath}>
          <p> Engine Instance Could Not Be Reached </p>
        </EngineErrorPage>
      );
    }

    if (permission.status === 401) {
      return (
        <EngineErrorPage rootPath={rootPath}>
          <div>
            <p>You are not an admin for this Engine instance. </p>
            <p> Contact the owner to add your wallet as an admin</p>
          </div>
        </EngineErrorPage>
      );
    }
  }

  return (
    <div>
      <EngineInstanceHeader
        instance={instance}
        rootPath={rootPath}
        teamSlug={team_slug}
      />
      {props.children}
    </div>
  );
}

function EngineInstanceHeader(props: {
  instance: EngineInstance;
  rootPath: string;
  teamSlug: string;
}) {
  const { instance } = props;

  return (
    <div>
      <div className="flex">
        <Button
          variant="ghost"
          className="-translate-x-2 flex h-auto items-center gap-2 px-2 py-1 text-muted-foreground hover:text-foreground"
        >
          <Link
            href={props.rootPath}
            aria-label="Go Back"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" /> Back
          </Link>
        </Button>
      </div>

      <div className="h-5" />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-semibold text-3xl tracking-tighter md:text-5xl">
            {instance.name}
          </h1>

          <div className="h-1" />

          <div className="flex items-center gap-3">
            {!instance.name.startsWith("https://") && (
              <CopyTextButton
                copyIconPosition="right"
                textToShow={instance.url}
                textToCopy={instance.url}
                tooltip="Copy Engine URL"
                variant="ghost"
                className="-translate-x-2 h-auto px-2 py-1 text-muted-foreground"
              />
            )}
          </div>
        </div>
        <EngineVersionBadge instance={instance} teamSlug={props.teamSlug} />
      </div>

      <div className="h-5" />
      <Separator />
      <div className="h-10 " />
    </div>
  );
}
