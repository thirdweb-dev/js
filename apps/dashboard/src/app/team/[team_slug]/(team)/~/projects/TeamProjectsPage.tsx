"use client";
import type { Team } from "@/api/team";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { LazyCreateProjectDialog } from "../../../../../../components/settings/ApiKeys/Create/LazyCreateAPIKeyDialog";
import {
  type ProjectWithAnalytics,
  TeamProjectsTable,
} from "./TeamProjectsTable";

export function TeamProjectsPage(props: {
  projects: ProjectWithAnalytics[];
  team: Team;
  client: ThirdwebClient;
}) {
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] =
    useState(false);
  const router = useDashboardRouter();

  return (
    <div>
      <TeamProjectsTable
        projects={props.projects}
        team={props.team}
        client={props.client}
        openCreateProjectModal={() => setIsCreateProjectDialogOpen(true)}
      />

      <LazyCreateProjectDialog
        open={isCreateProjectDialogOpen}
        onOpenChange={setIsCreateProjectDialogOpen}
        teamSlug={props.team.slug}
        teamId={props.team.id}
        onCreate={() => {
          router.refresh();
        }}
        enableNebulaServiceByDefault={props.team.enabledScopes.includes(
          "nebula",
        )}
      />
    </div>
  );
}
