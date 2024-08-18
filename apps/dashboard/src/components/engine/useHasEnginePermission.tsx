import { useQuery } from "@tanstack/react-query";
import { useLoggedInUser } from "../../@3rdweb-sdk/react/hooks/useLoggedInUser";

// If it fails to fetch, the server is unreachable.
// If it returns a 401, the user is not a valid admin.

export function useHasEnginePermission(props: {
  instanceUrl: string;
}) {
  const instanceUrl = props.instanceUrl;
  const token = useLoggedInUser().user?.jwt ?? null;

  return useQuery({
    queryKey: ["auth/permissions/get-all", instanceUrl, token],
    queryFn: async () => {
      const res = await fetch(`${instanceUrl}auth/permissions/get-all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        return {
          hasPermission: true,
        };
      }

      if (res.status === 401) {
        return {
          hasPermission: false,
          reason: "Unauthorized",
        };
      }

      throw new Error("Unexpected status code");
    },
    retry: false,
  });
}
