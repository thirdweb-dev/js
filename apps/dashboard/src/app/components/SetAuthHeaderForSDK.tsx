import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import type { GetAuthTokenResponse } from "../api/auth/get-auth-token/route";

function useAuthHeader() {
  const account = useActiveAccount();
  return useQuery({
    queryKey: ["authHeader", account?.address],
    queryFn: async () => {
      if (!account) {
        throw new Error("No account");
      }
      const res = await fetch(
        `/api/auth/get-auth-token?address=${account.address}`,
      );
      if (!res.ok) {
        throw new Error("Failed to get auth token");
      }
      const json = (await res.json()) as GetAuthTokenResponse;
      return json.jwt;
    },
    enabled: !!account,
    retry: false,
  });
}

export function SetAuthHeaderForSDK() {
  const authHeaderQuery = useAuthHeader();
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (authHeaderQuery.data) {
      window.TW_AUTH_TOKEN = authHeaderQuery.data;
    }
  }, [authHeaderQuery.data]);

  return null;
}
