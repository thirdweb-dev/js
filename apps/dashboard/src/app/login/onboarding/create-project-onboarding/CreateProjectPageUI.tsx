"use client";

import type { Project } from "@/api/projects";
import { useState } from "react";
import {
  CreateProjectForm,
  CreatedProjectDetails,
} from "../../../../components/settings/ApiKeys/Create";
import { CreateProjectOnboardingLayout } from "../onboarding-layout";

export function CreateProjectPageUI(props: {
  createProject: (param: Partial<Project>) => Promise<{
    project: Project;
    secret: string;
  }>;
  enableNebulaServiceByDefault: boolean;
  teamSlug: string;
}) {
  const [screen, setScreen] = useState<
    { id: "create" } | { id: "api-details"; project: Project; secret: string }
  >({ id: "create" });
  return (
    <CreateProjectOnboardingLayout currentStep={screen.id === "create" ? 1 : 2}>
      <div className="overflow-hidden rounded-lg border bg-card">
        {screen.id === "create" && (
          <CreateProjectForm
            showTitle={false}
            closeModal={undefined}
            createProject={props.createProject}
            onProjectCreated={(params) => {
              setScreen({
                id: "api-details",
                project: params.project,
                secret: params.secret,
              });
            }}
            enableNebulaServiceByDefault={props.enableNebulaServiceByDefault}
          />
        )}

        {screen.id === "api-details" && (
          <CreatedProjectDetails
            project={screen.project}
            secret={screen.secret}
            teamSlug={props.teamSlug}
          />
        )}
      </div>
    </CreateProjectOnboardingLayout>
  );
}
