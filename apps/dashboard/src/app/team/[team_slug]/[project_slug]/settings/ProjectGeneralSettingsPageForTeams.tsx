"use client";

import type { Project } from "@/api/projects";
import { SettingsCard } from "@/components/blocks/SettingsCard";
import { Input } from "@/components/ui/input";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ProjectGeneralSettingsPage } from "./ProjectGeneralSettingsPage";
import { updateProject } from "./updateProject";

export function ProjectGeneralSettingsPageForTeams(props: {
  team_slug: string;
  project: Project;
  apiKey: ApiKey;
  teamId: string;
}) {
  const router = useDashboardRouter();
  const { team_slug, project, apiKey } = props;
  const projectSettingsLayout = `/team/${team_slug}/${project.slug}/settings`;

  return (
    <div className="flex flex-col gap-8">
      <ProjectNameSetting
        name={project.name}
        update={async (name) => {
          await updateProject({
            projectId: project.id,
            teamId: props.teamId, // TODO: remove this when project.teamId is fixed in api server
            value: {
              name,
            },
          });
          router.refresh();
        }}
      />

      {/*  TODO - replace this when we have project services endpoints */}
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
        wording="project"
        hideFields={{
          name: true,
        }}
      />
    </div>
  );
}

function ProjectNameSetting(props: {
  name: string;
  update: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState(props.name);
  const updateName = useMutation({
    mutationFn: props.update,
  });

  const errorText = name === "" ? "Project name is required" : undefined;

  return (
    <SettingsCard
      header={{
        title: "Project Name",
        description:
          "Assign a name to identify your project on thirdweb dashboard",
      }}
      noPermissionText={undefined}
      errorText={errorText}
      saveButton={{
        onClick: () => {
          const promise = updateName.mutateAsync(name);
          toast.promise(promise, {
            success: "Project name updated successfully",
            error: "Failed to update project name",
          });
        },
        disabled: false,
        isPending: updateName.isPending,
      }}
      bottomText="Please use 64 characters at maximum"
    >
      <Input
        autoFocus
        placeholder="My Project"
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        className="max-w-[350px] bg-background"
      />
    </SettingsCard>
  );
}
