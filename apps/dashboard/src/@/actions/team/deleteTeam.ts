"use server";
import "server-only";
import { getAuthToken } from "@/api/auth-token";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";

export async function deleteTeam(options: { teamId: string }) {
  const token = await getAuthToken();
  if (!token) {
    return {
      errorMessage: "You are not authorized to perform this action.",
      status: "error",
    } as const;
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${options.teamId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    },
  );
  // handle errors
  if (!res.ok) {
    const reason = await res.text();
    console.error("failed to delete team", {
      reason,
      status: res.status,
    });
    switch (res.status) {
      case 400: {
        return {
          errorMessage: "Invalid team ID.",
          status: "error",
        } as const;
      }
      case 401: {
        return {
          errorMessage: "You are not authorized to perform this action.",
          status: "error",
        } as const;
      }

      case 403: {
        return {
          errorMessage: "You do not have permission to delete this team.",
          status: "error",
        } as const;
      }
      case 404: {
        return {
          errorMessage: "Team not found.",
          status: "error",
        } as const;
      }
      default: {
        return {
          errorMessage: "An unknown error occurred.",
          status: "error",
        } as const;
      }
    }
  }
  return {
    status: "success",
  } as const;
}
