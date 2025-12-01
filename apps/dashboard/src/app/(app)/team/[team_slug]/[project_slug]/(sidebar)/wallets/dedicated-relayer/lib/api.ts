import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import type { Fleet, FleetAnalytics } from "../types";

type GetFleetParams = {
  teamId: string;
  projectId: string;
  authToken: string;
};

/**
 * Fetches the fleet data for a project.
 * Returns null if no fleet exists (dev hasn't purchased).
 */
export async function getFleet(params: GetFleetParams): Promise<Fleet | null> {
  try {
    const response = await fetch(
      `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${params.teamId}/projects/${params.projectId}/fleet`,
      {
        headers: {
          Authorization: `Bearer ${params.authToken}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      },
    );

    if (response.status === 404) {
      // Fleet not purchased yet
      return null;
    }

    if (!response.ok) {
      console.error("Error fetching fleet:", response.status);
      return null;
    }

    const data = await response.json();
    return data.result as Fleet;
  } catch (error) {
    console.error("Error fetching fleet:", error);
    return null;
  }
}

export type GetFleetAnalyticsParams = {
  teamId: string;
  projectId: string;
  authToken: string;
  startDate?: string;
  endDate?: string;
};

/**
 * Fetches analytics for a fleet.
 * Only call this when fleet has executors (active state).
 */
export async function getFleetAnalytics(
  params: GetFleetAnalyticsParams,
): Promise<FleetAnalytics | null> {
  try {
    const url = new URL(
      `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${params.teamId}/projects/${params.projectId}/fleet/analytics`,
    );

    if (params.startDate) {
      url.searchParams.set("startDate", params.startDate);
    }
    if (params.endDate) {
      url.searchParams.set("endDate", params.endDate);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${params.authToken}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (!response.ok) {
      console.error("Error fetching fleet analytics:", response.status);
      return null;
    }

    const data = await response.json();
    return data.result as FleetAnalytics;
  } catch (error) {
    console.error("Error fetching fleet analytics:", error);
    return null;
  }
}
