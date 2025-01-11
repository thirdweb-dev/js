"use client";

import type { Team } from "@/api/team";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { ProjectGeneralSettingsPage } from "./ProjectGeneralSettingsPage";

export function ProjectGeneralSettingsPageForTeams(props: {
  team: Team;
  project_slug: string;
  apiKey: ApiKey;
}) {
  const router = useDashboardRouter();
  const { team, project_slug, apiKey } = props;
  const projectSettingsLayout = `/team/${team.slug}/${project_slug}/settings`;

  // TODO - add a Project Image form field on this page

  return (
    <ProjectGeneralSettingsPage
      apiKey={apiKey}
      paths={{
        aaConfig: `${projectSettingsLayout}/account-abstraction`,
        inAppConfig: `${projectSettingsLayout}/in-app-wallets`,
        payConfig: `${projectSettingsLayout}/pay`,
        afterDeleteRedirectTo: `/team/${team.slug}`,
      }}
      onKeyUpdated={() => {
        router.refresh();
      }}
      showNebulaSettings={team.enabledScopes.includes("nebula")}
    />
  );
}
