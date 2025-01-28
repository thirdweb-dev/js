"use client";

import type { Team } from "@/api/team";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { ProjectGeneralSettingsPage } from "./ProjectGeneralSettingsPage";

export function ProjectGeneralSettingsPageForTeams(props: {
  team: Team;
  project_slug: string;
  apiKey: ApiKey;
  projectId: string;
}) {
  const router = useDashboardRouter();
  const { team, project_slug, apiKey, projectId } = props;
  const projectLayout = `/team/${team.slug}/${project_slug}`;

  // TODO - add a Project Image form field on this page

  return (
    <ProjectGeneralSettingsPage
      apiKey={apiKey}
      projectId={projectId}
      paths={{
        aaConfig: `${projectLayout}/connect/account-abstraction/settings`,
        inAppConfig: `${projectLayout}/connect/in-app-wallets/settings`,
        payConfig: `${projectLayout}/connect/pay/settings`,
        afterDeleteRedirectTo: `/team/${team.slug}`,
      }}
      onKeyUpdated={() => {
        router.refresh();
      }}
      showNebulaSettings={team.enabledScopes.includes("nebula")}
    />
  );
}
