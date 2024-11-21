"use client";

import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { ProjectGeneralSettingsPage } from "./ProjectGeneralSettingsPage";

export function ProjectGeneralSettingsPageForTeams(props: {
  team_slug: string;
  project_slug: string;
  apiKey: ApiKey;
}) {
  const router = useDashboardRouter();
  const { team_slug, project_slug, apiKey } = props;
  const projectSettingsLayout = `/team/${team_slug}/${project_slug}/settings`;

  // TODO - add a Project Image form field on this page

  return (
    <ProjectGeneralSettingsPage
      apiKey={apiKey}
      paths={{
        aaConfig: `${projectSettingsLayout}/account-abstraction`,
        inAppConfig: `${projectSettingsLayout}/in-app-wallets`,
        payConfig: `${projectSettingsLayout}/pay`,
        afterDeleteRedirectTo: `/team/${team_slug}`,
      }}
      onKeyUpdated={() => {
        router.refresh();
      }}
    />
  );
}
