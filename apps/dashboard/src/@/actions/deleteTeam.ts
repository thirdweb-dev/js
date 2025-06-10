"use server";
import "server-only";
import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "../constants/public-envs";

export async function deleteTeam(options: {
  teamId: string;
}) {
  const token = await getAuthToken();
  if (!token) {
    return {
      status: "error",
      errorMessage: "You are not authorized to perform this action.",
    } as const;
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${options.teamId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  // handle errors
  if (!res.ok) {
    const reason = await res.text();
    console.error("failed to delete team", {
      status: res.status,
      reason,
    });
    switch (res.status) {
      case 400: {
        return {
          status: "error",
          errorMessage: "Invalid team ID.",
        } as const;
      }
      case 401: {
        return {
          status: "error",
          errorMessage: "You are not authorized to perform this action.",
        } as const;
      }

      case 403: {
        return {
          status: "error",
          errorMessage: "You do not have permission to delete this team.",
        } as const;
      }
      case 404: {
        return {
          status: "error",
          errorMessage: "Team not found.",
        } as const;
      }
      default: {
        return {
          status: "error",
          errorMessage: "An unknown error occurred.",
        } as const;
      }
    }
  }
  return {
    status: "success",
  } as const;
}
