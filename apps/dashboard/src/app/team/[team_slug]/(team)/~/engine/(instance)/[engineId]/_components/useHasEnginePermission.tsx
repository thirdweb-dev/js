import { useQuery } from "@tanstack/react-query";

// If it fails to fetch, the server is unreachable.
// If it returns a 401, the user is not a valid admin.

export function useHasEnginePermission(props: {
  instanceUrl: string;
  authToken: string;
}) {
  const { authToken, instanceUrl } = props;
  return useQuery({
    queryKey: ["auth/permissions/get-all", instanceUrl, authToken],
    queryFn: async () => {
      const res = await fetch(`${instanceUrl}auth/permissions/get-all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
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
