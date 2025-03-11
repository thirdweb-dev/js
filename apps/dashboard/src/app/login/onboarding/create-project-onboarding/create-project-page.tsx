"use client";

import { createProjectClient } from "@3rdweb-sdk/react/hooks/useApi";
import { CreateProjectPageUI } from "./CreateProjectPageUI";

export function CreateProjectPage(props: {
  enableNebulaServiceByDefault: boolean;
  teamSlug: string;
  teamId: string;
}) {
  return (
    <CreateProjectPageUI
      enableNebulaServiceByDefault={props.enableNebulaServiceByDefault}
      teamSlug={props.teamSlug}
      createProject={async (params) => {
        const res = await createProjectClient(props.teamId, params);
        return {
          project: res.project,
          secret: res.secret,
        };
      }}
    />
  );
}
