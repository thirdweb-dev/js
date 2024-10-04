"use server";

import type { Project } from "@/api/projects";
import { API_SERVER_URL } from "@/constants/env";
import { getAuthToken } from "../../../../api/lib/getAuthToken";

export async function updateProject(params: {
  projectId: string;
  teamId: string;
  value: Partial<Project>;
}) {
  const authToken = getAuthToken();

  if (!authToken) {
    throw new Error("No auth token");
  }

  const res = await fetch(
    `${API_SERVER_URL}/v1/teams/${params.teamId}/projects/${params.projectId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(params.value),
    },
  );

  if (!res.ok) {
    throw new Error("failed to update team");
  }
}
